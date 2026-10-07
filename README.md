# Freelancer Payment & Contract Tracking App

## Branch: `Invoice-and-Payment-Tracking`

**Component:** Invoice & Payment Tracking  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Invoice and Payment Tracking** component for the ISAACIFY mobile application. It covers full end-to-end finance overview dashboards, dynamic multi-item invoice creation, client bank payment submissions, transaction audit ledgers, client home overview, in-app notification center, user profiles, and calendar schedules.

---

## 🚀 Assigned Jira Work Items & Implementation Details

### 🔹 SCRUM-27: Implement Finance Overview Screen
* **Source Files:**
  * `src/features/invoices/screens/FinanceScreen.tsx`
  * `src/app/finance.tsx`
* **Key Features:**
  * Real-time financial summary cards: **Net Revenue**, **Collected Payments**, **Outstanding Balance**, and **Logged Expenses**.
  * Dynamic cashflow bar chart visualization with 3-Month and 6-Month timeline toggles.
  * Direct action buttons to issue new invoices and record direct ledger transactions.

---

### 🔹 SCRUM-28: Implement Invoices Screen
* **Source Files:**
  * `src/features/invoices/screens/FinanceScreen.tsx`
* **Key Features:**
  * Categorized invoice directory with filter chips (*All*, *Pending*, *Paid*, *Overdue*).
  * Quick live search by client name, project title, or invoice number.
  * One-tap invoice inspection, payment status badges, and deletion actions with Cloud Firestore real-time synchronization.

---

### 🔹 SCRUM-30: Implement Create/Edit Invoice Screen
* **Source Files:**
  * `src/features/invoices/components/CreateInvoiceModal.tsx`
  * `src/utils/invoiceDocument.ts`
* **Key Features:**
  * Dynamic multi-line item invoice builder with real-time subtotal, custom tax percentage, and discount calculations.
  * Client and Project selector linked to active client contacts.
  * One-tap **⚡ Quick Fill** for rapid demoing and testing.
  * Printable HTML/PDF invoice generation and export engine via Expo Print and Sharing.

---

### 🔹 SCRUM-31: Implement Payments & History Screen - Page 6
* **Source Files:**
  * `src/features/payments/components/SubmitPaymentModal.tsx`
  * `src/features/invoices/components/RecordTransactionModal.tsx`
  * `src/utils/payments.ts`
  * `src/utils/finance.ts`
* **Key Features:**
  * Client payment submission modal with bank reference IDs, transaction notes, and bank slip image attachments.
  * Provider payment verification workflow: verify receipt or reject invalid payments with balance safety checks preventing overpayments.
  * Comprehensive transaction history ledger tracking both income and expense categories.

---

### 🔹 SCRUM-32: Implement Client Home Screen
* **Source Files:**
  * `src/features/home/components/ClientHomeView.tsx`
  * `src/features/home/screens/HomeScreen.tsx`
  * `src/app/home.tsx`
* **Key Features:**
  * Dedicated client portal home view showcasing active projects, pending deliverables, and unsettled invoice balances.
  * Interactive action anchors allowing clients to review deliverables, message providers, and trigger payments directly.

---

### 🔹 SCRUM-33: Implement Notifications Screen
* **Source Files:**
  * `src/features/home/components/NotificationCenterModal.tsx`
* **Key Features:**
  * Real-time in-app notification center categorizing invoice updates, milestone approvals, deliverables, and payment receipts.
  * Unread badges with 1-tap "Mark all as read" and direct modal navigation to linked entities.

---

### 🔹 SCRUM-24: Implement Profile Screen
* **Source Files:**
  * `src/features/settings/screens/MoreSettingsScreen.tsx`
  * `src/features/settings/components/EditProfileModal.tsx`
  * `src/app/more.tsx`
* **Key Features:**
  * User profile management screen with photo avatar, bio notes, hourly rates, and skills tags.
  * Perspective switcher allowing instant 1-tap evaluation between Freelancer, Company, and Client roles.

---

### 🔹 SCRUM-25 & SCRUM-26: Implement Calendar Screen
* **Source Files:**
  * `src/features/reminders/components/RemindersModal.tsx`
* **Key Features:**
  * Calendar schedule and reminder agenda displaying upcoming client meetings, invoice due dates, and project milestones.
  * Create, edit, and toggle reminders with date/time selectors.

---

## 📁 Branch Structure
```text
├── README.md                                  # Documentation & Jira Mapping
├── FILE_MANIFEST.md                           # Detailed file index
└── src/
    ├── app/
    │   ├── finance.tsx                        # Route: Finance & Invoices
    │   ├── home.tsx                           # Route: Home Dashboard
    │   └── more.tsx                           # Route: Settings & Profile
    ├── features/
    │   ├── invoices/
    │   │   ├── screens/
    │   │   │   └── FinanceScreen.tsx          # SCRUM-27 & 28: Finance Overview & Invoices
    │   │   └── components/
    │   │       ├── CashflowChart.tsx          # Cashflow bar chart visualizer
    │   │       ├── CreateInvoiceModal.tsx     # SCRUM-30: Create/Edit Invoice Screen
    │   │       └── RecordTransactionModal.tsx # Ledger recording modal
    │   ├── payments/
    │   │   └── components/
    │   │       └── SubmitPaymentModal.tsx     # SCRUM-31: Payments & Verification Screen
    │   ├── home/
    │   │   ├── screens/
    │   │   │   └── HomeScreen.tsx             # Root home screen
    │   │   └── components/
    │   │       ├── ClientHomeView.tsx         # SCRUM-32: Client Home Screen
    │   │       └── NotificationCenterModal.tsx# SCRUM-33: Notifications Screen
    │   ├── settings/
    │   │   ├── screens/
    │   │   │   └── MoreSettingsScreen.tsx     # SCRUM-24: Profile & Settings Screen
    │   │   └── components/
    │   │       └── EditProfileModal.tsx       # Profile editor modal
    │   └── reminders/
    │       └── components/
    │           └── RemindersModal.tsx         # SCRUM-25 & 26: Calendar & Reminders
    ├── services/
    │   ├── financeExport.ts                   # PDF invoice and financial report export
    │   ├── firebase.ts                        # Cloud Firestore initialization
    │   └── firebaseService.ts                 # Real-time Firestore sync listeners
    └── utils/
        ├── finance.ts                         # Financial formulas & currency formatting
        ├── invoiceDocument.ts                 # Clean HTML invoice print template engine
        └── payments.ts                        # Payment verification & anti-overpayment logic
```
