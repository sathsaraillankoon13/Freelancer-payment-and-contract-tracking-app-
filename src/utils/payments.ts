import type { WorkspaceData } from '../services/storage';
import { roundMoney } from './finance';

/** One transition per submission. Repeating verification returns the original workspace. */
export function verifySubmission(data: WorkspaceData, submissionId: string, now = new Date()): WorkspaceData {
  const invoice = data.invoices.find(i => i.payments.some(p => p.id === submissionId));
  const submission = invoice?.payments.find(p => p.id === submissionId);
  if (!invoice || !submission || submission.status !== 'pending_review') return data;
  if (!Number.isFinite(submission.amount) || submission.amount <= 0 || submission.amount > roundMoney(invoice.totalAmount - invoice.paidAmount)) throw new Error('Payment exceeds the remaining invoice balance.');
  const paidAmount = roundMoney(invoice.paidAmount + submission.amount);
  const outstandingAmount = roundMoney(invoice.totalAmount - paidAmount);
  const timestamp = now.toISOString();
  return {
    ...data,
    invoices: data.invoices.map(i => i.id !== invoice.id ? i : {
      ...i, paidAmount, outstandingAmount, status: outstandingAmount === 0 ? 'Paid' : 'Partially Paid',
      payments: i.payments.map(p => p.id !== submissionId ? p : { ...p, status: 'verified', verifiedAt: timestamp }),
    }),
    transactions: [...data.transactions, {
      id: `tx_payment_${submissionId}`, workspaceId: invoice.workspaceId, invoiceId: invoice.id, paymentId: submissionId,
      source: 'payment', title: `Payment · ${invoice.clientName}`, amount: submission.amount, type: 'income',
      currency: invoice.currency, category: 'Client payment', subtitle: invoice.invoiceNumber,
      date: timestamp.slice(0, 10), occurredAt: timestamp,
    }],
    clients: data.clients.map(c => c.id === invoice.clientId ? { ...c, outstandingBalance: Math.max(0, roundMoney((c.outstandingBalance || 0) - submission.amount)) } : c),
  };
}

export function rejectSubmission(data: WorkspaceData, submissionId: string, reason: string): WorkspaceData {
  return { ...data, invoices: data.invoices.map(i => ({ ...i, payments: i.payments.map(p => p.id === submissionId && p.status === 'pending_review' ? { ...p, status: 'rejected', rejectionReason: reason.trim() || 'Payment could not be verified' } : p) })) };
}
