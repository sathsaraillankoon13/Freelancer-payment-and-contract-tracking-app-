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
