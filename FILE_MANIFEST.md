# File Manifest — Contract & Scope Management

**Member:** Perera K.A (IT23567924)  
**Branch:** `Contract-and-Scope-Management`  
**Component:** Contract & Scope Management  

| File Path | Description | Jira Story / Rubric |
|---|---|---|
| `src/features/contracts/screens/ContractTermsScreen.tsx` | Contract terms library with categorized clauses and Add/Edit Term modal | Member 1: Terms CRUD |
| `src/features/contracts/screens/ContractPreviewScreen.tsx` | Formal legal agreement preview with PDF export & sharing | Member 1: Contract Preview |
| `src/features/contracts/screens/ContractReviewScreen.tsx` | Client contract review, amendment requests & digital signature | Member 1: Contract Review |
| `src/features/projects/screens/ProjectScopeScreen.tsx` | In-scope deliverables, out-of-scope exclusions & change requests | Member 1: Scope Management |
| `src/features/projects/components/ProjectTermsModal.tsx` | Project terms clause editor and viewer modal | Member 1: Terms Modal |
| `src/features/projects/screens/ProjectsScreen.tsx` | Active projects list and status filtering | **SCRUM-52** |
| `src/features/clients/components/ClientDetailsModal.tsx` | Detailed client modal with active projects and billing metrics | **SCRUM-53** |
| `src/features/home/components/ClientHomeView.tsx` | Client home dashboard portal with scope and timeline views | **SCRUM-54** |
| `src/features/clients/screens/ClientsScreen.tsx` | Client directory list with live search and company affiliation | **SCRUM-55** |
| `src/features/auth/screens/ForgotPasswordScreen.tsx` | Password reset recovery screen | **SCRUM-17** |
| `src/features/auth/screens/EmailVerificationScreen.tsx` | 6-digit OTP email verification screen with timer | **SCRUM-17** |
| `src/features/reminders/components/RemindersModal.tsx` | Deadline reminders manager with status, snooze & delete | **SCRUM-18** (Reminders CRUD) |
| `src/features/settings/screens/MoreSettingsScreen.tsx` | More menu, legal links, currency and workspace settings | **SCRUM-19** |
| `src/features/auth/screens/LoginScreen.tsx` | User login screen with credentials validation | Auth & Onboarding |
| `src/features/auth/screens/RegisterScreen.tsx` | User registration and workspace initialization screen | Auth & Onboarding |
| `src/features/auth/screens/AccountTypeScreen.tsx` | Freelancer / Client role selection screen | Auth & Onboarding |
| `src/features/auth/screens/SplashScreen.tsx` | App launch splash screen with branding animation | Auth & Onboarding |
| `src/features/onboarding/screens/OnboardingScreen.tsx` | 3-slide interactive onboarding carousel | Auth & Onboarding |
| `src/services/firebase.ts` | Firebase initialization with mobile long polling | Cloud Firestore Sync |
| `src/services/firebaseService.ts` | Real-time two-way sync for projects, clients & scope | Cloud Firestore Sync |
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
