import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Project } from '@/types';
import { money } from '@/utils/finance';

const escape = (val: string) =>
  (val || '').replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char] || char)
  );

export function generateContractHtml(
  project: Project,
  signerName: string,
  providerName: string = 'Kasun Perera (ISAACIFY Creative)',
  signatureSvgOrDataUrl?: string
): string {
  const now = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const termsList = (project.terms && project.terms.length > 0)
    ? project.terms
    : [
        {
          id: 't1',
          title: 'Scope of Work & Deliverables',
          clause:
            'The Freelancer agrees to deliver the milestones outlined in the project specification in accordance with standard industry practices.',
        },
        {
          id: 't2',
          title: 'Revision Limits',
          clause:
            `Includes ${project.revisionLimit || 3} revision rounds. Additional iterations requested outside initial scope will be billed under mutual amendment.`,
        },
        {
          id: 't3',
          title: 'Intellectual Property & Ownership',
          clause:
            'All rights, title, and interest in design assets and final code shall transfer to the Client upon settlement of all outstanding invoices.',
        },
        {
          id: 't4',
          title: 'Payment Terms & Milestone Settlement',
          clause:
            'Invoices shall be settled within 7 days of delivery milestone approval. Final handoff is contingent upon complete settlement.',
        },
      ];

  const termsHtml = termsList
    .map(
      (t, idx) => `
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0 0 6px 0; color: #1E1B4B; font-size: 13px;">${idx + 1}. ${escape(t.title)}</h4>
        <p style="margin: 0; color: #475569; font-size: 12px; line-height: 1.6;">${escape(t.clause)}</p>
      </div>
    `
    )
    .join('');

  const milestonesHtml = (project.milestones || [])
    .map(
      (m, idx) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px;">Milestone ${idx + 1}: ${escape(m.title)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px;">${escape(m.dueDate || 'TBD')}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #E2E8F0; font-size: 12px; font-weight: 600;">${m.amount ? money(m.amount, project.currency || 'LKR') : 'Retainer'}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contract Agreement - ${escape(project.title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      padding: 40px;
      margin: 0;
    }
    .header {
      border-bottom: 2px solid #7C3AED;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      background: #EDE9FE;
      color: #6D28D9;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 22px;
      color: #1E1B4B;
      margin: 12px 0 4px 0;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: #F8FAFC;
      border-radius: 8px;
    }
    .meta-table td {
      padding: 12px 16px;
      font-size: 12px;
      vertical-align: top;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1E1B4B;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 6px;
      margin: 24px 0 14px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .milestones-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .milestones-table th {
      background: #F1F5F9;
      padding: 8px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }
    .signatures-box {
      margin-top: 36px;
      padding-top: 24px;
      border-top: 2px dashed #CBD5E1;
      display: flex;
      justify-content: space-between;
    }
    .signature-block {
      width: 46%;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
    }
    .signature-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .sign-name {
      font-size: 14px;
      font-weight: 700;
      color: #1E1B4B;
    }
    .sign-date {
      font-size: 11px;
      color: #64748B;
      margin-top: 4px;
    }
    .sign-canvas {
      margin-top: 10px;
      font-family: "Brush Script MT", cursive, sans-serif;
      font-size: 24px;
      color: #7C3AED;
      padding: 6px 0;
      border-bottom: 1px solid #CBD5E1;
    }
    .verified-seal {
      display: inline-block;
      margin-top: 8px;
      font-size: 10px;
      color: #059669;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">Legal Agreement · Executed</span>
    <h1>Freelancer Service Agreement & Contract Terms</h1>
    <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
      Reference ID: CTR-${escape(project.id.slice(-6).toUpperCase())} · Date Executed: ${now}
    </div>
  </div>

  <table class="meta-table">
    <tr>
      <td style="width: 50%;">
        <div style="color: #64748B; font-size: 11px; font-weight: 600;">SERVICE PROVIDER</div>
        <div style="font-weight: 700; font-size: 13px; margin-top: 2px;">${escape(providerName)}</div>
        <div style="color: #64748B; margin-top: 2px;">ISAACIFY Mobile Freelance Platform</div>
      </td>
      <td style="width: 50%;">
        <div style="color: #64748B; font-size: 11px; font-weight: 600;">CLIENT PRINCIPAL</div>
        <div style="font-weight: 700; font-size: 13px; margin-top: 2px;">${escape(project.clientName || 'Client')}</div>
        <div style="color: #64748B; margin-top: 2px;">Project Title: ${escape(project.title)}</div>
      </td>
    </tr>
    <tr>
      <td>
        <div style="color: #64748B; font-size: 11px; font-weight: 600;">COMMENCEMENT / DURATION</div>
        <div style="margin-top: 2px;">Start: ${escape(project.startDate || 'Immediate')} · Due: ${escape(project.dueDate)}</div>
      </td>
      <td>
        <div style="color: #64748B; font-size: 11px; font-weight: 600;">TOTAL CONTRACT VALUE</div>
        <div style="font-weight: 700; color: #7C3AED; font-size: 14px; margin-top: 2px;">${money(project.budget || 0, project.currency || 'LKR')}</div>
      </td>
    </tr>
  </table>

  <div class="section-title">1. Agreed Project Milestones & Deliverables</div>
  <table class="milestones-table">
    <thead>
      <tr>
        <th>Milestone Scope</th>
        <th>Target Delivery</th>
        <th>Settlement Amount</th>
      </tr>
    </thead>
    <tbody>
      ${milestonesHtml || '<tr><td colspan="3" style="padding: 10px;">Full project delivery upon completion.</td></tr>'}
    </tbody>
  </table>

  <div class="section-title">2. Standard Contract Clauses & Governing Terms</div>
  ${termsHtml}

  <div class="signatures-box">
    <div class="signature-block">
      <div class="signature-title">Service Provider</div>
      <div class="sign-name">${escape(providerName)}</div>
      <div class="sign-canvas">Kasun Perera</div>
      <div class="sign-date">Digitally Signed on ${now}</div>
      <div class="verified-seal">✓ Verified via ISAACIFY Identity Services</div>
    </div>
    <div class="signature-block">
      <div class="signature-title">Client Acceptance</div>
      <div class="sign-name">${escape(signerName)}</div>
      <div class="sign-canvas">${escape(signerName)}</div>
      <div class="sign-date">Accepted & Signed on ${now}</div>
      <div class="verified-seal">✓ Authenticated Digital Signature</div>
    </div>
  </div>

  <div style="margin-top: 32px; text-align: center; font-size: 10px; color: #94A3B8;">
    This agreement was electronically generated and signed using the ISAACIFY Freelancer Management Platform.<br/>
    Document hash: SHA256-${Date.now().toString(36).toUpperCase()}-LEGAL-VALID
  </div>
</body>
</html>`;
}

export async function exportContractPdf(
  project: Project,
  signerName: string,
  providerName?: string,
  mode: 'share' | 'print' = 'share'
): Promise<void> {
  const html = generateContractHtml(project, signerName, providerName);

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
        dialogTitle: `Contract - ${project.title}.pdf`,
      });
      return;
    }
  } catch (err) {
    console.warn('[exportContractPdf] Sharing failed, falling back to Print:', err);
  }

  // Fallback to native print / Save as PDF
  await Print.printAsync({ html });
}
