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
# Common Core File Manifest — main branch

**Branch:** `main`  
**Scope:** Shared Project Core, Authentication & Common App Shell  

| Directory / File | Description | Category |
|---|---|---|
| `src/features/auth/screens/SplashScreen.tsx` | Branding splash screen | Authentication |
| `src/features/auth/screens/OnboardingScreen.tsx` | Value proposition introduction carousel | Authentication |
| `src/features/auth/screens/RoleSelectionScreen.tsx` | Role picker: Freelancer, Team, Client | Authentication |
| `src/features/auth/screens/LoginScreen.tsx` | User login screen with validation | Authentication |
| `src/features/auth/screens/RegisterScreen.tsx` | User registration and account creation | Authentication |
| `src/features/auth/screens/ForgotPasswordScreen.tsx` | Password recovery screen | Authentication |
| `src/features/home/screens/HomeScreen.tsx` | Main home container with role switcher | Home Dashboard |
| `src/features/home/components/FreelancerHomeView.tsx` | Freelancer metrics, cashflow & active projects | Home Dashboard |
| `src/features/home/components/ClientHomeView.tsx` | Client project tracking & invoice alerts | Home Dashboard |
| `src/features/home/components/NotificationCenterModal.tsx` | Notification center modal with unread badges | Home Dashboard |
| `src/features/settings/screens/MoreSettingsScreen.tsx` | Account overview and preferences menu | Settings |
| `src/features/settings/components/EditProfileModal.tsx` | Profile info, currency and agency branding | Settings |
| `src/features/settings/components/TeamManagementModal.tsx` | Team invitations and permission management | Settings |
| `src/features/reminders/components/RemindersModal.tsx` | Reminders and meeting schedule modal | Settings |
| `src/components/navigation/BottomTabBar.tsx` | Shared 5-tab bottom navigation bar | Navigation |
| `src/context/AppContext.tsx` | Core application state and role switching logic | State Management |
| `src/theme/*` | Design tokens: colors, spacing, typography | Design System |
