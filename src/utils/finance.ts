import type { Invoice, TransactionItem } from '../types';
import { parseDate } from './dates';

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export function money(value: number, currency: string): string {
  return `${currency} ${Number.isFinite(value) ? value.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0'}`;
}
export function compactMoney(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return String(Math.round(value));
}

export function invoiceTotals(items: { quantity: number; rate: number }[], taxRate = 0, discount = 0) {
  if (!items.length || items.some(i => !Number.isFinite(i.quantity) || i.quantity <= 0 || !Number.isFinite(i.rate) || i.rate < 0)) throw new Error('Enter a valid quantity and rate for every item.');
  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100 || !Number.isFinite(discount) || discount < 0) throw new Error('Enter a valid tax and discount.');
  const subtotal = roundMoney(items.reduce((sum, item) => sum + roundMoney(item.quantity * item.rate), 0));
  if (discount > subtotal) throw new Error('Discount cannot exceed the subtotal.');
  const taxable = roundMoney(subtotal - discount);
  const taxAmount = roundMoney(taxable * taxRate / 100);
  return { subtotal, discount, taxAmount, totalAmount: roundMoney(taxable + taxAmount) };
}

export function financeSummary(invoices: Invoice[], transactions: TransactionItem[], currency: string) {
  const scoped = invoices.filter(i => i.currency === currency && i.status !== 'Draft' && i.status !== 'Void');
  const income = transactions.filter(t => t.currency === currency && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const received = roundMoney(income);
  const expenses = roundMoney(transactions.filter(t => t.currency === currency && t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  const netProfit = roundMoney(received - expenses);
  return {
    received, expenses, netProfit, currency,
    outstanding: roundMoney(scoped.reduce((s, i) => s + i.outstandingAmount, 0)),
    total: roundMoney(scoped.reduce((s, i) => s + i.totalAmount, 0)),
    cashflowStatus: netProfit < 0 ? 'Deficit' : received === 0 && expenses === 0 ? 'No activity' : 'Healthy',
  };
}

export function monthlyCashflow(transactions: TransactionItem[], currency: string, count = 6, now = new Date()) {
  const months = Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - count + i + 1, 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString('en-US', { month: 'short' }), year: date.getFullYear(), income: 0, expenses: 0, transactions: [] as TransactionItem[] };
  });
  let undated = 0;
  for (const transaction of transactions) {
    if (transaction.currency !== currency || !Number.isFinite(transaction.amount) || transaction.amount <= 0) continue;
    // Never assign an old record without a year to an invented year.
    const date = parseDate(transaction.occurredAt || transaction.date);
    if (!date) { undated += 1; continue; }
    const month = months.find(m => m.key === `${date.getFullYear()}-${date.getMonth()}`);
    if (!month) continue;
    if (transaction.type === 'income') month.income = roundMoney(month.income + transaction.amount);
    else month.expenses = roundMoney(month.expenses + transaction.amount);
    month.transactions.push(transaction);
  }
  return { months, undated };
}

export function nextInvoiceNumber(invoices: Invoice[], sequence = 0, now = new Date()) {
  const prefix = `INV-${now.getFullYear()}-`;
  const highest = invoices.reduce((n, i) => i.invoiceNumber.startsWith(prefix) ? Math.max(n, Number(i.invoiceNumber.slice(prefix.length)) || 0) : n, sequence);
  return { sequence: highest + 1, number: `${prefix}${String(highest + 1).padStart(3, '0')}` };
}
