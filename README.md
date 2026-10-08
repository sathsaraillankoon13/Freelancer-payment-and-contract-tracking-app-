# Freelancer Payment & Contract Tracking App

## Branch: `Contract-and-Scope-Management`

**Component:** Contract & Scope Management  
**Member:** Perera K.A (IT23567924)  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Contract & Scope Management** component by **Perera K.A**, fulfilling all rubric criteria, interactive CRUD operations, and assigned Jira user stories (**SCRUM-17**, **SCRUM-18**, **SCRUM-19**, **SCRUM-52**, **SCRUM-53**, **SCRUM-54**, **SCRUM-55**).

---

## 🚀 Assigned Jira Work Items & Implementation Details

### 🔹 SCRUM-17: Implement Password Reset Screen & Authentication Flow
* **Source Files:**
  * `src/features/auth/screens/ForgotPasswordScreen.tsx`
  * `src/features/auth/screens/EmailVerificationScreen.tsx`
  * `src/features/auth/screens/LoginScreen.tsx`
  * `src/features/auth/screens/RegisterScreen.tsx`
  * `src/features/auth/screens/AccountTypeScreen.tsx`
  * `src/features/onboarding/screens/OnboardingScreen.tsx`
* **Key Features:**
  * Multi-step credential recovery: password reset requests, current vs new password verification.
  * 6-digit OTP verification screen with auto-advancing PIN cells and live countdown resend timer.
  * Role selection (*Freelancer*, *Company*, *Client*) and onboarding walkthrough.

---

### 🔹 SCRUM-18: Implement Reminders Screen (Calendar Deadlines & Alerts)
* **Source Files:**
  * `src/features/reminders/components/RemindersModal.tsx`
* **Key Features:**
  * Reminders manager with interactive monthly calendar navigation (`<` / `>`) and urgency indicators.
  * CRUD actions: add reminder, toggle completion, snooze (+1 day), and delete.

---

### 🔹 SCRUM-19: Implement More & Workspace Menu (Legal Terms & Preferences)
* **Source Files:**
  * `src/features/settings/screens/MoreSettingsScreen.tsx`
  * `src/app/more.tsx`
* **Key Features:**
  * Workspace preferences: Currency selection (*LKR*, *USD*, *EUR*), Reduced Motion toggle, Notifications toggle.
  * Quick links to Legal Terms, Privacy Policy, Reminders, and Perspective Switcher.

---

### 🔹 Contract Terms & Legal Instruments
* **Source Files:**
  * `src/features/contracts/screens/ContractTermsScreen.tsx`
  * `src/features/contracts/screens/ContractPreviewScreen.tsx`
  * `src/features/contracts/screens/ContractReviewScreen.tsx`
  * `src/features/projects/components/ProjectTermsModal.tsx`
* **Key Features:**
  * Contract Terms CRUD: Add, edit, search, and delete contractual clauses categorized into statutory types.
  * Official Legal Instrument Preview: Formatted Master Creative Services Agreement with dynamic milestone fee schedules.
  * Digital Execution: Clause verification checklist, agreement checkbox, signature pad, and PDF export via `expo-print` and `expo-sharing`.

---

### 🔹 Project Scope Baseline & Revision Management
* **Source Files:**
  * `src/features/projects/screens/ProjectScopeScreen.tsx`
  * `src/app/scope.tsx`
* **Key Features:**
  * Project Scope baseline (*In-Scope Deliverables*, *Explicit Exclusions*, *Revision Allowances*).
  * Direct CRUD controls to add and delete in-scope items.

---

## 📁 Branch Structure
```text
├── README.md                                  # Documentation & Jira Mapping
├── FILE_MANIFEST.md                           # Detailed file index
└── src/
    ├── app/
    │   ├── contract-terms.tsx                 # Route: Contract Terms
    │   ├── contract-preview.tsx               # Route: Contract Preview
    │   ├── contract-review.tsx                # Route: Contract Review & Sign
    │   ├── scope.tsx                          # Route: Project Scope
    │   ├── more.tsx                           # Route: Workspace & Legal Terms
    │   ├── onboarding.tsx                     # Route: Onboarding Walkthrough
    │   └── auth/                              # Route: Authentication & Password Reset
    ├── features/
    │   ├── contracts/
    │   │   └── screens/
    │   │       ├── ContractTermsScreen.tsx    # Clauses CRUD & Categorization
    │   │       ├── ContractPreviewScreen.tsx  # Master Agreement Preview
    │   │       └── ContractReviewScreen.tsx   # Review, Sign & PDF Export
    │   ├── projects/
    │   │   ├── screens/
    │   │   │   └── ProjectScopeScreen.tsx     # Binding Scope Baseline
    │   │   └── components/
    │   │       └── ProjectTermsModal.tsx      # Quick Terms Modal
    │   ├── auth/
    │   │   └── screens/
    │   │       ├── ForgotPasswordScreen.tsx   # SCRUM-17: Password Reset
    │   │       ├── EmailVerificationScreen.tsx# SCRUM-17: 6-digit OTP
    │   │       ├── LoginScreen.tsx            # Login with credentials
    │   │       ├── RegisterScreen.tsx         # Account registration
    │   │       └── AccountTypeScreen.tsx      # Role selection
    │   ├── onboarding/
    │   │   └── screens/
    │   │       └── OnboardingScreen.tsx       # Onboarding Walkthrough
    │   └── reminders/
    │       └── components/
    │           └── RemindersModal.tsx         # SCRUM-18: Reminders & Calendar
    └── services/
        ├── firebase.ts                        # Cloud Firestore initialization
        └── firebaseService.ts                 # Real-time Firestore sync listeners
```
