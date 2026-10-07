# Freelancer Payment & Contract Tracking App

## Branch: `Contract-and-Scope-Management`

**Member:** Perera K.A (IT23567924)  
**Component:** Contract & Scope Management  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Contract & Scope Management** component by **Perera K.A**, fulfilling all rubric criteria, interactive CRUD operations, and assigned Jira user stories (**SCRUM-17**, **SCRUM-18**, **SCRUM-19**, **SCRUM-52**, **SCRUM-53**, **SCRUM-54**, **SCRUM-55**).

---

## 🚀 Assigned Jira User Stories & Implementation Details

### 🔹 SCRUM-52: Implement Projects List Screen
* **Source Files:**
  * `src/features/projects/screens/ProjectsScreen.tsx`
  * `src/app/projects.tsx`
* **Key Features:**
  * Active projects catalog with real-time keyword search, status filtering, and budget tracking.
  * Direct linkage to project scope review and contract terms.

---

### 🔹 SCRUM-53: Implement Client Details Screen
* **Source Files:**
  * `src/features/clients/components/ClientDetailsModal.tsx`
* **Key Features:**
  * Comprehensive client profile view with linked active projects, total billing records, and direct contact channels.

---

### 🔹 SCRUM-54: Implement Client Home Page
* **Source Files:**
  * `src/features/home/components/ClientHomeView.tsx`
* **Key Features:**
  * Dedicated client overview portal detailing ongoing project scope, milestone timelines, and contract acceptance status.

---

### 🔹 SCRUM-55: Implement Client Page List
* **Source Files:**
  * `src/features/clients/screens/ClientsScreen.tsx`
  * `src/app/clients.tsx`
* **Key Features:**
  * Client directory list with live search, company affiliations, and contact quick actions.

---

### 🔹 SCRUM-17: Implement Password Reset Screen
* **Source Files:**
  * `src/features/auth/screens/ForgotPasswordScreen.tsx`
  * `src/app/auth/forgot-password.tsx`
  * `src/features/auth/screens/EmailVerificationScreen.tsx`
  * `src/app/auth/email-verification.tsx`
  * `src/features/auth/screens/LoginScreen.tsx`
  * `src/features/auth/screens/RegisterScreen.tsx`
  * `src/features/auth/screens/AccountTypeScreen.tsx`
  * `src/features/onboarding/screens/OnboardingScreen.tsx`
  * `src/features/auth/screens/SplashScreen.tsx`
* **Key Features:**
  * Clean password reset recovery flow with registered email lookup.
  * 6-digit numeric OTP verification code input with auto-advance and resend timer.
  * Form validation, security state resets, and instant navigation back to secure login.
  * 3-step interactive onboarding tutorial walkthrough with skip, dot indicators, and role selection.

---

### 🔹 SCRUM-18: Implement Reminders Screen
* **Source Files:**
  * `src/features/reminders/components/RemindersModal.tsx`
* **Key Features (Reminders CRUD):**
  * **Create:** Add custom project/client deadline reminders with due dates and priority tags.
  * **Read:** Categorized reminders display with pending vs. completed indicators and overdue badges.
  * **Update:** Toggle completion status and snooze reminders.
  * **Delete:** Secure removal of obsolete reminders with confirmation.

---

### 🔹 SCRUM-19: Implement More & Workspace Menu
* **Source Files:**
  * `src/features/settings/screens/MoreSettingsScreen.tsx`
  * `src/app/more.tsx`
* **Key Features:**
  * Central workspace management hub and application navigation.
  * Access to agency profile, team management, security preferences, and currency settings.
  * Legal terms links: Privacy Policy, Terms of Service, and Master Service Agreement overview.
  * Perspective switcher for 1-tap evaluation across Freelancer, Company, and Client roles.

---

## ⚖️ Contract & Scope Management Core & CRUD

### 📄 1. Contract Terms & Clauses Management (CRUD 1)
* **Source Files:**
  * `src/features/contracts/screens/ContractTermsScreen.tsx`
  * `src/app/contract-terms.tsx`
  * `src/features/projects/components/ProjectTermsModal.tsx`
* **Key Features:**
  * Categorized clause library: *Scope & Revisions*, *Payment & Late Fees*, *Intellectual Property*, *Termination*, and *General*.
  * **Add / Edit Clause Modal:** Real-time clause title, category, legal text editing, and standard clause toggles.
  * Clause deletion with safety confirmations.

### 📄 2. Official Preview Contract Screen
* **Source Files:**
  * `src/features/contracts/screens/ContractPreviewScreen.tsx`
  * `src/app/contract-preview.tsx`
* **Key Features:**
  * Formatted official formal binding agreement (*Master Creative Services & Independent Contractor Agreement*).
  * Direct system share action and high-resolution PDF export alert simulation.

### 📄 3. Contract Review & Digital Signature
* **Source Files:**
  * `src/features/contracts/screens/ContractReviewScreen.tsx`
  * `src/app/contract-review.tsx`
* **Key Features:**
  * Clause-by-clause client review checklist with interactive check indicators.
  * **Request Amendment Modal:** Submit proposed wording changes to the service provider.
  * Terms acceptance checkbox and **Digital Signature Pad** (full legal name confirmation).

### 📄 4. Project Scope Management
* **Source Files:**
  * `src/features/projects/screens/ProjectScopeScreen.tsx`
  * `src/app/scope.tsx`
* **Key Features:**
  * In-Scope deliverables itemization with add/remove actions.
  * Out-of-Scope exclusions list preventing unauthorized scope creep.
  * **Scope Change Request Modal:** Submit formal change requests with LKR budget and timeline impact.

---

## 📁 Branch Structure
```text
├── FILE_MANIFEST.md                                   # Comprehensive file manifest
├── README.md                                          # This documentation
├── push_to_github.bat                                 # One-click push script
└── src/
    ├── app/
    │   ├── index.tsx                                  # Splash screen route
    │   ├── onboarding.tsx                             # Onboarding route
    │   ├── scope.tsx                                  # Project Scope route
    │   ├── contract-terms.tsx                         # Contract Terms route
    │   ├── contract-preview.tsx                       # Preview Contract route
    │   ├── contract-review.tsx                        # Contract Review & Sign route
    │   ├── projects.tsx                               # Projects catalog route
    │   ├── clients.tsx                                # Clients directory route
    │   ├── more.tsx                                   # More settings route
    │   └── auth/
    │       ├── account-type.tsx                       # Role selection route
    │       ├── login.tsx                              # Login route
    │       ├── register.tsx                           # Registration route
    │       ├── email-verification.tsx                 # OTP verification route
    │       └── forgot-password.tsx                    # Password reset route
    ├── features/
    │   ├── auth/screens/                              # Authentication screens
    │   ├── contracts/screens/                         # Contract terms, preview, review
    │   ├── onboarding/screens/                        # Onboarding screens
    │   ├── projects/screens/ & components/            # Scope screen & terms modal
    │   ├── clients/screens/ & components/             # Clients list & details modal
    │   ├── home/components/                           # Client home portal view
    │   ├── reminders/components/                      # Reminders management modal
    │   └── settings/screens/                          # More settings screen
    └── services/
        ├── firebase.ts                                # Firebase Cloud Firestore initialization
        └── firebaseService.ts                         # Real-time Firestore sync listeners
```
