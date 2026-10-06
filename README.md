# Freelancer Payment & Contract Tracking App

## Branch: `Invoice-and-Payment-Tracking`

**Component:** Payment & Invoice Management  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the project implementation for **Payment & Invoice Management**. It includes two primary functional screens / pages, interactive modals, financial calculation engines, and export utilities.

### 📄 Page 1: Invoice & Cashflow Management Page
* **Source:** `src/features/invoices/screens/FinanceScreen.tsx`
* **Key Components:**
  * `src/features/invoices/components/CreateInvoiceModal.tsx`
  * `src/features/invoices/components/CashflowChart.tsx`
* **Core Functionality:**
  * Real-time cashflow metrics (Net profit, Collected revenue, Logged expenses, Outstanding balance).
  * 3-Month and 6-Month dynamic cashflow bar chart visualization.
  * Multi-item invoice builder with real-time tax (%) and discount calculations.
  * Invoice lifecycle management (Draft, Sent, Partially Paid, Paid, Void).
  * HTML / PDF invoice document exporter with print styling.

### 📄 Page 2: Payment Tracking & Verification Page
* **Source:**
  * `src/features/payments/components/SubmitPaymentModal.tsx`
  * `src/features/invoices/components/RecordTransactionModal.tsx`
* **Key Utilities:**
  * `src/utils/payments.ts`
  * `src/utils/finance.ts`
* **Core Functionality:**
  * Client bank transfer receipt & payment proof attachment upload.
  * Payment verification and receipt approval workflow with prevention of overpayment.
  * Direct payment recording and cash transaction ledger.
  * Real-time audit trail and transaction categorization.

---

## 📁 Branch Structure
```text
├── README.md                                  # This documentation
└── src/
    ├── features/
    │   ├── invoices/
    │   │   ├── screens/
    │   │   │   └── FinanceScreen.tsx          # Page 1: Finance & Invoices
    │   │   └── components/
    │   │       ├── CashflowChart.tsx          # Monthly cashflow chart
    │   │       ├── CreateInvoiceModal.tsx     # Invoice generator
    │   │       └── RecordTransactionModal.tsx # Ledger recorder
    │   └── payments/
    │       └── components/
    │           └── SubmitPaymentModal.tsx     # Page 2: Payment submission & receipts
    ├── services/
    │   └── financeExport.ts                   # PDF invoice & financial report export
    └── utils/
        ├── finance.ts                         # Financial formulas & formatting
        ├── invoiceDocument.ts                 # HTML invoice generator
        └── payments.ts                        # Payment verification rules
```
