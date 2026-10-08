# File Manifest — Contract & Scope Management

**Component:** Contract & Scope Management  
**Branch:** `Contract-and-Scope-Management`  
**Member:** Perera K.A (IT23567924)  
**Assigned Jira Work Items:** SCRUM-17, SCRUM-18, SCRUM-19, SCRUM-52, SCRUM-53, SCRUM-54, SCRUM-55  

| File Path | Description / Purpose | Work Item |
|---|---|---|
| `src/features/contracts/screens/ContractTermsScreen.tsx` | Contract terms editor, clause search, category filters | Contract Terms CRUD |
| `src/features/contracts/screens/ContractPreviewScreen.tsx` | Official Legal Instrument Master Creative Services preview | Legal Contract Preview |
| `src/features/contracts/screens/ContractReviewScreen.tsx` | Digital signature pad, clause verification checklist, PDF export | Review & Sign |
| `src/features/projects/screens/ProjectScopeScreen.tsx` | Project scope baseline, in-scope deliverables, exclusions & revisions | Scope Baseline |
| `src/features/projects/components/ProjectTermsModal.tsx` | Modal popup for editing contract terms within project context | Terms Modal |
| `src/features/auth/screens/ForgotPasswordScreen.tsx` | Password reset recovery screen with verification flow | **SCRUM-17** |
| `src/features/auth/screens/EmailVerificationScreen.tsx` | 6-digit OTP email verification screen with timer | **SCRUM-17** |
| `src/features/reminders/components/RemindersModal.tsx` | Deadline reminders manager with status, snooze & delete | **SCRUM-18** |
| `src/features/settings/screens/MoreSettingsScreen.tsx` | More menu, legal links, currency and workspace settings | **SCRUM-19** |
| `src/features/auth/screens/LoginScreen.tsx` | User login screen with credentials validation | Auth & Onboarding |
| `src/features/auth/screens/RegisterScreen.tsx` | User registration and workspace initialization screen | Auth & Onboarding |
| `src/features/auth/screens/AccountTypeScreen.tsx` | Freelancer / Client role selection screen | Auth & Onboarding |
| `src/features/auth/screens/SplashScreen.tsx` | App launch splash screen with branding animation | Auth & Onboarding |
| `src/features/onboarding/screens/OnboardingScreen.tsx` | 3-slide interactive onboarding carousel | Auth & Onboarding |
| `src/services/firebase.ts` | Firebase initialization with mobile long polling | Cloud Firestore Sync |
| `src/services/firebaseService.ts` | Real-time two-way sync for projects, clients & scope | Cloud Firestore Sync |
