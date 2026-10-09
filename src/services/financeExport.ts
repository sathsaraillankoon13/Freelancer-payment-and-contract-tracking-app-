import { invoiceHtml } from '@/utils/invoiceDocument';
import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Invoice, TransactionItem } from '@/types';
import { financeSummary, money } from '@/utils/finance';

const escape = (value: string) =>
  String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] || ''));

export async function exportFinanceReport(
  invoices: Invoice[],
  transactions: TransactionItem[],
  currency: string,
  name: string,
  mode: 'share' | 'print' = 'share'
) {
  const summary = financeSummary(invoices, transactions, currency);
  const rows = (transactions || [])
    .filter((t) => t.currency === currency)
    .map(
      (t) =>
        `<tr><td>${escape(t.date)}</td><td>${escape(t.title)}</td><td>${escape(t.type)}</td><td style="text-align: right;">${escape(money(t.amount, currency))}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Finance Report - ${escape(name)}</title>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; color: #1A1424; padding: 32px; max-width: 800px; margin: 0 auto; }
    h1 { color: #7852CC; margin-bottom: 4px; }
    h2 { color: #4A3A69; margin-top: 0; font-size: 16px; }
    .summary-grid { display: flex; gap: 12px; margin: 20px 0; background: #FAF8FD; padding: 16px; border-radius: 12px; border: 1px solid #ECEAF5; }
    .summary-card { flex: 1; text-align: center; }
    .summary-val { font-size: 16px; font-weight: bold; margin-top: 4px; }
    .positive { color: #166534; }
    .negative { color: #DC2626; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th { background: #F4F1FB; color: #4A3A69; padding: 10px 12px; text-align: left; font-size: 12px; border-bottom: 1px solid #DED8EE; }
    td { padding: 10px 12px; border-bottom: 1px solid #ECEAF5; font-size: 13px; }
    .footer { margin-top: 32px; font-size: 11px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <h1>Finance Report</h1>
  <h2>${escape(name)} · ${escape(currency)}</h2>
  <p style="font-size: 12px; color: #64748B;">Generated on ${escape(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}</p>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div style="font-size: 11px; color: #64748B;">Received Income</div>
      <div class="summary-val positive">${escape(money(summary.received, currency))}</div>
    </div>
    <div class="summary-card">
      <div style="font-size: 11px; color: #64748B;">Expenses</div>
      <div class="summary-val negative">${escape(money(summary.expenses, currency))}</div>
    </div>
    <div class="summary-card">
      <div style="font-size: 11px; color: #64748B;">Net Cashflow</div>
      <div class="summary-val" style="color: #7852CC;">${escape(money(summary.netProfit, currency))}</div>
    </div>
    <div class="summary-card">
      <div style="font-size: 11px; color: #64748B;">Outstanding</div>
      <div class="summary-val" style="color: #D97706;">${escape(money(summary.outstanding, currency))}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Type</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="4" style="text-align: center; color: #94A3B8; padding: 20px;">No recorded transactions.</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    ISAACIFY Freelancer App · Certified Financial Report
  </div>
</body>
</html>`;

  if (Platform.OS === 'web' || mode === 'print') {
    await Print.printAsync({ html });
    return;
  }

  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: '.pdf',
        dialogTitle: 'Share Finance Report',
      });
      return;
    }
  } catch (err) {
    console.warn('[exportFinanceReport] Sharing failed, falling back to Print:', err);
  }

  // Resilient fallback: Print spooler provides "Save as PDF" natively on Android
  await Print.printAsync({ html });
}

export async function exportInvoice(
  invoice: Invoice,
  name: string,
  mode: 'share' | 'print' = 'share'
) {
  const html = invoiceHtml(invoice, name);

  if (Platform.OS === 'web' || mode === 'print') {
    await Print.printAsync({ html });
    return;
  }

  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        UTI: '.pdf',
        dialogTitle: `${invoice.invoiceNumber || 'Invoice'}.pdf`,
      });
      return;
    }
  } catch (err) {
    console.warn('[exportInvoice] Sharing failed, falling back to Print:', err);
  }

  // Resilient fallback: native Print manager with "Save as PDF"
  await Print.printAsync({ html });
}
