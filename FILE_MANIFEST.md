# File Manifest — Payment & Invoice Management

**Component:** Payment & Invoice Management  
**Branch:** `Invoice-and-Payment-Tracking`  
**Assigned Jira Work Items:** SCRUM-24, SCRUM-25, SCRUM-26, SCRUM-27, SCRUM-28, SCRUM-30, SCRUM-31, SCRUM-32, SCRUM-33  

| Jira Key | Work Item | File Path | Functional Area |
|---|---|---|---|
| **SCRUM-27** | Implement Finance Overview Screen | `src/features/invoices/screens/FinanceScreen.tsx` | Financial Dashboard & Cashflow |
| **SCRUM-28** | Implement Invoices Screen | `src/features/invoices/screens/FinanceScreen.tsx` | Invoice Directory & Filtering |
| **SCRUM-30** | Implement Create/Edit Invoice Screen | `src/features/invoices/components/CreateInvoiceModal.tsx` | Dynamic Multi-item Invoice Builder |
| **SCRUM-31** | Implement Payments & History Screen - Page 6 | `src/features/payments/components/SubmitPaymentModal.tsx` | Payment Submission & Verification Ledger |
| **SCRUM-32** | Implement Client Home Screen | `src/features/home/components/ClientHomeView.tsx` | Client Dashboard & Projects Overview |
| **SCRUM-33** | Implement Notifications Screen | `src/features/home/components/NotificationCenterModal.tsx` | Notification Center & Alert Badges |
| **SCRUM-24** | Implement Profile Screen | `src/features/settings/screens/MoreSettingsScreen.tsx` | User Profile & Perspective Switcher |
| **SCRUM-25** | Implement Calendar Screen | `src/features/reminders/components/RemindersModal.tsx` | Calendar Agenda & Meeting Tracker |
| **SCRUM-26** | Implement Calendar Screen | `src/features/reminders/components/RemindersModal.tsx` | Reminders & Timeline Schedule |
| Support | Financial Calculations & Print | `src/utils/finance.ts`, `src/utils/invoiceDocument.ts`, `src/services/financeExport.ts` | Financial Utilities & Exporters |
| Support | Real-time Cloud Sync | `src/services/firebase.ts`, `src/services/firebaseService.ts` | Cloud Firestore Live Invoices & Payments Sync |
