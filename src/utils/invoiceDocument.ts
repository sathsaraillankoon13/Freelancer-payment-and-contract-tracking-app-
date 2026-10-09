import type { Invoice } from '@/types';

export function invoiceHtml(invoice: Invoice, sender: string): string {
  const escape = (value: any = '') =>
    String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char] || ''));

  const curr = invoice.currency || 'LKR';
  const amount = (n: number = 0) =>
    `${escape(curr)} ${(Number(n) || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const items = Array.isArray(invoice.items) && invoice.items.length > 0
    ? invoice.items
    : [
        {
          id: 'item_default',
          description: 'Professional Freelance Services',
          quantity: 1,
          rate: invoice.totalAmount || 0,
          amount: invoice.totalAmount || 0,
        },
      ];

  const rows = items
    .map((item) => {
      const q = Number(item.quantity) || 1;
      const r = Number(item.rate) || 0;
      const amt = Number(item.amount) || q * r;
      return `<tr>
        <td>${escape(item.description || 'Service')}</td>
        <td style="text-align: center;">${q}</td>
        <td style="text-align: right;">${amount(r)}</td>
        <td style="text-align: right; font-weight: 600;">${amount(amt)}</td>
      </tr>`;
    })
    .join('');

  const itemsSum = items.reduce(
    (sum, i) => sum + (Number(i.amount) || (Number(i.quantity) || 1) * (Number(i.rate) || 0)),
    0
  );
  const subtotal = invoice.subtotal !== undefined ? invoice.subtotal : itemsSum;
  const discount = invoice.discount || 0;
  const taxAmount = invoice.taxAmount || 0;
  const taxRate = invoice.taxRate;
  const total = invoice.totalAmount !== undefined ? invoice.totalAmount : Math.max(0, subtotal + taxAmount - discount);
  const paid = invoice.paidAmount || 0;
  const balance = invoice.outstandingAmount !== undefined ? invoice.outstandingAmount : Math.max(0, total - paid);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${escape(invoice.invoiceNumber)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1A1424;
      padding: 36px;
      line-height: 1.6;
      background: #FFFFFF;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #7852CC;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      color: #7852CC;
      font-size: 26px;
      font-weight: 800;
      margin: 0 0 4px 0;
      letter-spacing: 0.5px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      background: #ECEAF5;
      color: #5833AA;
    }
    .badge-paid { background: #DCFCE7; color: #166534; }
    .badge-draft { background: #F3F4F6; color: #4B5563; }
    .badge-sent { background: #EDE9FE; color: #6D28D9; }
    .meta-box {
      display: flex;
      justify-content: space-between;
      background: #FAF8FD;
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 28px;
      border: 1px solid #ECEAF5;
    }
    .meta-col { flex: 1; }
    .meta-col p { margin: 4px 0; font-size: 13px; }
    .meta-label { font-weight: 700; color: #64748B; font-size: 11px; text-transform: uppercase; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      margin-bottom: 24px;
    }
    th {
      background: #F4F1FB;
      color: #4A3A69;
      padding: 12px;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      border-bottom: 1px solid #DED8EE;
    }
    td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid #ECEAF5;
    }
    .totals-container {
      margin-left: auto;
      width: 280px;
      margin-top: 20px;
      background: #FAF8FD;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #ECEAF5;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .totals-row-total {
      border-top: 2px solid #7852CC;
      padding-top: 10px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 800;
      color: #7852CC;
    }
    .notes-box {
      margin-top: 32px;
      padding: 14px 18px;
      background: #FBFBFE;
      border-left: 4px solid #7852CC;
      border-radius: 4px;
      font-size: 12px;
      color: #4A3A69;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #ECEAF5;
      font-size: 11px;
      color: #94A3B8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">INVOICE</h1>
      <div style="font-size: 14px; font-weight: 700; color: #4A3A69;">${escape(invoice.invoiceNumber)}</div>
    </div>
    <div style="text-align: right;">
      <span class="badge ${invoice.status === 'Paid' ? 'badge-paid' : invoice.status === 'Draft' ? 'badge-draft' : 'badge-sent'}">
        ${escape(invoice.status)}
      </span>
      <div style="font-size: 12px; color: #64748B; margin-top: 6px;">Issued: ${escape(invoice.issueDate || 'Today')}</div>
      <div style="font-size: 12px; font-weight: 700; color: #DC2626;">Due: ${escape(invoice.dueDate)}</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-col">
      <div class="meta-label">Billed By</div>
      <p style="font-weight: 700; font-size: 14px; color: #1A1424;">${escape(sender)}</p>
      <p style="color: #64748B;">ISAACIFY Freelancer Verified</p>
    </div>
    <div class="meta-col">
      <div class="meta-label">Billed To</div>
      <p style="font-weight: 700; font-size: 14px; color: #1A1424;">${escape(invoice.clientName)}</p>
      <p style="color: #64748B;">Project: ${escape(invoice.projectTitle)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align: left;">Description</th>
        <th style="text-align: center; width: 60px;">Qty</th>
        <th style="text-align: right; width: 110px;">Rate</th>
        <th style="text-align: right; width: 120px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="totals-container">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span style="font-weight: 600;">${amount(subtotal)}</span>
    </div>
    ${
      discount > 0
        ? `<div class="totals-row" style="color: #DC2626;">
            <span>Discount:</span>
            <span>-${amount(discount)}</span>
          </div>`
        : ''
    }
    ${
      taxAmount > 0
        ? `<div class="totals-row" style="color: #7852CC;">
            <span>Tax${taxRate ? ` (${taxRate}%)` : ''}:</span>
            <span>+${amount(taxAmount)}</span>
          </div>`
        : ''
    }
    <div class="totals-row totals-row-total">
      <span>Total:</span>
      <span>${amount(total)}</span>
    </div>
    ${
      paid > 0
        ? `<div class="totals-row" style="color: #166534; font-size: 12px; margin-top: 6px;">
            <span>Paid:</span>
            <span>${amount(paid)}</span>
          </div>
          <div class="totals-row" style="color: #DC2626; font-size: 12px;">
            <span>Balance Due:</span>
            <span>${amount(balance)}</span>
          </div>`
        : ''
    }
  </div>

  ${
    invoice.notes
      ? `<div class="notes-box">
          <strong>Notes & Instructions:</strong><br/>
          ${escape(invoice.notes).replace(/\n/g, '<br/>')}
        </div>`
      : ''
  }

  <div class="footer">
    Generated with ISAACIFY Freelancer App · Certified Digital Invoicing System
  </div>
</body>
</html>`;
}
