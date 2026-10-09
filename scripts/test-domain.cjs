/* global __dirname */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const cache = new Map();
function domain(name) {
  const filename = path.resolve(__dirname, '../src/utils', name + '.ts');
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = new Module(filename); cache.set(filename, module);
  module.filename = filename;
  module.paths = Module._nodeModulePaths(path.dirname(filename));
  module.require = request => request.startsWith('./') ? domain(request.slice(2)) : require(request);
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  module._compile(result.outputText, filename);
  return module.exports;
}
const { invoiceTotals, monthlyCashflow, financeSummary, nextInvoiceNumber } = domain('finance');
const { verifySubmission, rejectSubmission } = domain('payments');
const { scopeWorkspace } = domain('permissions');
const { daysUntil, parseDate, dateKey } = domain('dates');
const { invoiceHtml } = domain('invoiceDocument');
let count = 0;
function test(name, run) { run(); count++; console.log('PASS ' + name); }
const empty = () => ({ clients: [], projects: [], tasks: [], invoices: [], transactions: [], deliverables: [], messages: [], meetings: [], notifications: [], teamMembers: [] });
const invoice = { id: 'inv', workspaceId: 'ws', clientId: 'client', clientName: 'Client', invoiceNumber: 'INV-2026-005', currency: 'LKR', status: 'Sent', totalAmount: 100, paidAmount: 0, outstandingAmount: 100, payments: [{ id: 'pay', status: 'pending_review', amount: 40 }], items: [] };
const data = { ...empty(), invoices: [invoice], clients: [{ id: 'client', outstandingBalance: 100 }] };
test('Verification is idempotent and has one ledger entry', () => { const once = verifySubmission(data, 'pay'); const twice = verifySubmission(once, 'pay'); assert.equal(once, twice); assert.equal(twice.invoices[0].paidAmount, 40); assert.equal(twice.transactions.length, 1); assert.equal(twice.clients[0].outstandingBalance, 60); });
test('Verified payments cannot be rejected', () => { assert.equal(rejectSubmission(verifySubmission(data, 'pay'), 'pay', 'Incorrect').invoices[0].payments[0].status, 'verified'); });
test('Overpayment is rejected without mutating data', () => { const invalid = { ...data, invoices: [{ ...invoice, paidAmount: 90 }] }; assert.throws(() => verifySubmission(invalid, 'pay')); assert.equal(invalid.invoices[0].paidAmount, 90); });
test('Sequential verification preserves both payments', () => { const multiple = { ...data, invoices: [{ ...invoice, payments: [...invoice.payments, { id: 'pay2', status: 'pending_review', amount: 60 }] }] }; const paid = verifySubmission(verifySubmission(multiple, 'pay'), 'pay2'); assert.equal(paid.invoices[0].status, 'Paid'); assert.equal(paid.invoices[0].outstandingAmount, 0); assert.equal(paid.transactions.length, 2); });
test('Currency summaries exclude drafts and other currencies', () => { const tx = [{ currency: 'LKR', type: 'income', amount: 75 }, { currency: 'USD', type: 'income', amount: 1000 }, { currency: 'LKR', type: 'expense', amount: 10 }]; const summary = financeSummary([invoice, { ...invoice, status: 'Draft', outstandingAmount: 500 }], tx, 'LKR'); assert.equal(summary.netProfit, 65); assert.equal(summary.outstanding, 100); });
test('Invoice receipts are not counted twice', () => { const paid = verifySubmission(data, 'pay'); assert.equal(financeSummary(paid.invoices, paid.transactions, 'LKR').received, 40); });
test('Monthly bars use full dates and currency, excluding undated records', () => { const tx = [{ currency: 'LKR', date: '2026-09-10', type: 'income', amount: 80 }, { currency: 'LKR', date: '2026-10-01', type: 'expense', amount: 10 }, { currency: 'LKR', date: '13 Sep', type: 'income', amount: 300 }, { currency: 'USD', date: '2026-09-10', type: 'income', amount: 500 }]; const chart = monthlyCashflow(tx, 'LKR', 3, new Date(2026, 9, 4)); assert.equal(chart.months[1].income, 80); assert.equal(chart.months[2].expenses, 10); assert.equal(chart.undated, 1); });
test('Monthly buckets cross the year boundary', () => { const chart = monthlyCashflow([], 'LKR', 3, new Date(2027, 0, 3)); assert.deepEqual(chart.months.map(m => m.year), [2026, 2026, 2027]); });
test('Invoice numbers do not reuse deleted numbers', () => { assert.equal(nextInvoiceNumber([invoice], 20, new Date(2026, 9, 4)).number, 'INV-2026-021'); });
test('Tax, discount and decimal rounding are calculated consistently', () => { const result = invoiceTotals([{ quantity: 3, rate: 0.1 }, { quantity: 1, rate: 100 }], 10, 10); assert.equal(result.subtotal, 100.3); assert.equal(result.taxAmount, 9.03); assert.equal(result.totalAmount, 99.33); assert.throws(() => invoiceTotals([{ quantity: 0, rate: 10 }])); assert.throws(() => invoiceTotals([{ quantity: 1, rate: 10 }], 10, 11)); });
test('Calendar dates validate leap days and prevent timezone shifts', () => { assert.equal(parseDate('2026-02-29'), null); assert.ok(parseDate('2028-02-29')); assert.equal(dateKey(parseDate('2026-10-04')), '2026-10-04'); assert.equal(daysUntil('2026-10-01', new Date(2026, 9, 4)), -3); });
test('Clients see only their own workspace records', () => { const workspace = { ...empty(), clients: [{ id: 'c1', workspaceId: 'ws', email: 'one@example.com', internalNotes: 'private' }, { id: 'c2', workspaceId: 'ws', email: 'two@example.com' }], projects: [{ id: 'p1', workspaceId: 'ws', clientId: 'c1', dueDate: '2026-10-30' }, { id: 'p2', workspaceId: 'ws', clientId: 'c2', dueDate: '2026-10-30' }], invoices: [{ ...invoice, clientId: 'c1' }, { ...invoice, id: 'other', clientId: 'c2' }], tasks: [{ id: 't', workspaceId: 'ws', projectId: 'p1' }], transactions: [{ workspaceId: 'ws' }] }; const visible = scopeWorkspace(workspace, { id: 'u1', workspaceId: 'ws', role: 'client', email: 'one@example.com' }); assert.equal(visible.projects.length, 1); assert.equal(visible.invoices.length, 1); assert.equal(visible.clients[0].internalNotes, undefined); assert.equal(visible.tasks.length, 0); assert.equal(visible.transactions.length, 0); });
test('Team members see assigned projects and no finances', () => { const workspace = { ...empty(), teamMembers: [{ id: 'tm', workspaceId: 'ws', email: 'member@example.com', assignedProjectIds: ['p1'] }], projects: [{ id: 'p1', workspaceId: 'ws', clientId: 'c1', dueDate: '2026-10-30' }, { id: 'p2', workspaceId: 'ws', clientId: 'c2', dueDate: '2026-10-30' }], invoices: [invoice], transactions: [{ workspaceId: 'ws' }] }; const visible = scopeWorkspace(workspace, { id: 'u', workspaceId: 'ws', role: 'team', teamRole: 'member', email: 'member@example.com' }); assert.deepEqual(visible.projects.map(p => p.id), ['p1']); assert.equal(visible.invoices.length, 0); assert.equal(visible.transactions.length, 0); });
test('Invoice PDF escapes names and notes', () => { const html = invoiceHtml({ ...invoice, clientName: '<script>alert(1)</script>', projectTitle: 'Project', dueDate: '2026-10-30', notes: '<img src=x onerror=alert(1)>', items: [] }, 'A & B'); assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;')); assert.ok(html.includes('A &amp; B')); });
test('Clients cannot see unpublished invoice drafts', () => { const workspace = { ...empty(), clients: [{ id: 'client', workspaceId: 'ws', email: 'client@example.com' }], invoices: [{ ...invoice, status: 'Draft' }] }; assert.equal(scopeWorkspace(workspace, { id: 'client', workspaceId: 'ws', role: 'client', email: 'client@example.com' }).invoices.length, 0); });
test('Comments visibility respects internal vs shared for clients', () => {
  const workspace = {
    ...empty(),
    clients: [{ id: 'c1', workspaceId: 'ws', email: 'client@example.com' }],
    projects: [{ id: 'p1', workspaceId: 'ws', clientId: 'c1', dueDate: '2026-10-30' }],
    comments: [
      { id: 'cm1', workspaceId: 'ws', targetType: 'project', targetId: 'p1', authorId: 'u1', authorName: 'Freelancer', authorRole: 'freelancer', text: 'Internal team note', createdAt: '2026-10-01', visibility: 'internal' },
      { id: 'cm2', workspaceId: 'ws', targetType: 'project', targetId: 'p1', authorId: 'u1', authorName: 'Freelancer', authorRole: 'freelancer', text: 'Shared update for client', createdAt: '2026-10-02', visibility: 'shared' }
    ]
  };
  const clientView = scopeWorkspace(workspace, { id: 'c1', workspaceId: 'ws', role: 'client', email: 'client@example.com' });
  assert.equal(clientView.comments.length, 1);
  assert.equal(clientView.comments[0].id, 'cm2');
  assert.equal(clientView.comments[0].text, 'Shared update for client');

  const providerView = scopeWorkspace(workspace, { id: 'u1', workspaceId: 'ws', role: 'freelancer', email: 'dev@isaacify.com' });
  assert.equal(providerView.comments.length, 2);
});
test('Team members only see comments for their assigned projects', () => {
  const workspace = {
    ...empty(),
    teamMembers: [{ id: 'tm1', workspaceId: 'ws', email: 'member@example.com', assignedProjectIds: ['p1'] }],
    projects: [
      { id: 'p1', workspaceId: 'ws', clientId: 'c1', dueDate: '2026-10-30' },
      { id: 'p2', workspaceId: 'ws', clientId: 'c1', dueDate: '2026-10-30' }
    ],
    comments: [
      { id: 'cm1', workspaceId: 'ws', targetType: 'project', targetId: 'p1', authorId: 'u1', authorName: 'Admin', authorRole: 'team', text: 'On P1', createdAt: '2026-10-01', visibility: 'internal' },
      { id: 'cm2', workspaceId: 'ws', targetType: 'project', targetId: 'p2', authorId: 'u1', authorName: 'Admin', authorRole: 'team', text: 'On P2', createdAt: '2026-10-01', visibility: 'internal' }
    ]
  };
  const memberView = scopeWorkspace(workspace, { id: 'tm1', workspaceId: 'ws', role: 'team', teamRole: 'member', email: 'member@example.com' });
  assert.equal(memberView.comments.length, 1);
  assert.equal(memberView.comments[0].id, 'cm1');
});
test('Multi-item invoice calculations handle multiple line items with tax and discount', () => {
  const items = [
    { description: 'Design Sprint', quantity: 2, rate: 500 },
    { description: 'Mobile Dev', quantity: 10, rate: 150 },
    { description: 'QA Testing', quantity: 5, rate: 80 }
  ];
  // Subtotal = 1000 + 1500 + 400 = 2900
  // Discount = 290 -> remaining 2610
  // Tax 5% = 130.5 -> total = 2740.5
  const totals = invoiceTotals(items, 5, 290);
  assert.equal(totals.subtotal, 2900);
  assert.equal(totals.discount, 290);
  assert.equal(totals.taxAmount, 130.5);
  assert.equal(totals.totalAmount, 2740.5);
});
console.log(`${count} domain regression tests passed.`);

