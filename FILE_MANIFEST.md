# File Manifest — Payment & Invoice Management

**Component:** Payment & Invoice Management  
**Branch:** `Invoice-and-Payment-Tracking`  

| File Path | Description | Functional Area |
|---|---|---|
| `src/features/invoices/screens/FinanceScreen.tsx` | Core Finance & Invoices overview screen | Page 1: Invoice Management |
| `src/features/invoices/components/CreateInvoiceModal.tsx` | Multi-line item invoice builder with tax & discount logic | Page 1: Invoice Management |
| `src/features/invoices/components/CashflowChart.tsx` | Dynamic monthly cashflow visualizer | Page 1: Invoice Management |
| `src/features/invoices/components/RecordTransactionModal.tsx` | Income and expense transaction logger | Page 2: Payment Tracking |
| `src/features/payments/components/SubmitPaymentModal.tsx` | Bank transfer receipt upload and payment submitter | Page 2: Payment Tracking |
| `src/services/financeExport.ts` | PDF invoice document and financial report export | Services |
| `src/utils/finance.ts` | Financial math, net calculations and currency formats | Utilities |
| `src/utils/invoiceDocument.ts` | Clean invoice HTML print template engine | Utilities |
| `src/utils/payments.ts` | Receipt validation, payment balance & verification rules | Utilities |
