import { invoiceHtml } from '@/utils/invoiceDocument';
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Invoice, TransactionItem } from '@/types';
import { financeSummary, money } from '@/utils/finance';
const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
export async function exportFinanceReport(invoices: Invoice[], transactions: TransactionItem[], currency: string, name: string) {
  const summary = financeSummary(invoices, transactions, currency);
  const rows = transactions.filter(t => t.currency === currency).map(t => `<tr><td>${escape(t.date)}</td><td>${escape(t.title)}</td><td>${escape(t.type)}</td><td>${escape(money(t.amount, currency))}</td></tr>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font:14px Arial;color:#292035;padding:32px}h1{color:#7852cc}table{width:100%;border-collapse:collapse}td,th{padding:12px;text-align:left;border-bottom:1px solid #eee}th{background:#f5f1fb}p{line-height:1.8}</style></head><body><h1>Finance report</h1><h2>${escape(name)}</h2><p>Generated ${escape(new Date().toLocaleDateString())} · ${escape(currency)}<br>Income: ${escape(money(summary.received, currency))}<br>Expenses: ${escape(money(summary.expenses, currency))}<br>Net cashflow: ${escape(money(summary.netProfit, currency))}<br>Outstanding invoices: ${escape(money(summary.outstanding, currency))}</p><table><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No recorded transactions.</td></tr>'}</tbody></table></body></html>`;
  if (Platform.OS === 'web') { await Print.printAsync({ html }); return; }
  if (!await Sharing.isAvailableAsync()) throw new Error('Sharing is unavailable on this device.');
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: 'Share finance report' });
}

export async function exportInvoice(invoice: Invoice, name: string) {
  const html = invoiceHtml(invoice, name);
  if (Platform.OS === 'web') { await Print.printAsync({ html }); return; }
  if (!await Sharing.isAvailableAsync()) throw new Error('Sharing is unavailable on this device.');
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: invoice.invoiceNumber });
}
