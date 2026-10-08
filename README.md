# ISAACIFY Mobile CRM — Full Integrated Application

> **Main Branch — Production Master & Unified System Core**  
> Complete cross-platform mobile CRM app for Freelancers, Teams & Clients.  
> Built with **React Native (Expo SDK 57)**, **TypeScript**, **Cloud Firestore**, and **Hermes**.

---

## 📌 Group Project Allocation & Component Mapping

| Member Name | Student ID | Component / Specialization | Git Branch |
|---|---|---|---|
| **Perera K.A** | IT23567924 | Contract & Scope Management, Terms, Reminders & Auth | `Contract-and-Scope-Management` |
| **Nimnadi S.D.T** | IT23569218 | Payment & Invoice Management, Cashflow & Financials | `Invoice-and-Payment-Tracking` |
| **Illankoon I.A.K.S** | IT23554818 | Deliverable & Approval Management, Milestones & Tasks | `Milestone-and-Approval-Management` |
| **Silva S.T.S** | IT23550780 | Client & Project Management, Directory & Messaging | `Client-and-Project-Management` |

---

## 🚀 Assigned Jira Work Items & Verification Status

### 🔹 SCRUM-65: Verify Git Branches & Initial Integration
* **Status:** **Completed & Verified**
* **Scope:** 
  * Audited and synchronized all 4 dedicated remote branches (`Contract-and-Scope-Management`, `Invoice-and-Payment-Tracking`, `Milestone-and-Approval-Management`, `Client-and-Project-Management`).
  * Ensured zero Git merge conflicts and validated clean fast-forward pushes to GitHub origin.
  * Verified self-contained dependencies across all individual member contributions.

---

### 🔹 SCRUM-69: Run Integration & Prepare Test Documentation
* **Status:** **Completed & Verified**
* **Scope:**
  * End-to-end integration and cross-feature execution:
    * Auth / Session Restore ➔ Home Dashboard ➔ Projects Catalog ➔ Client Directory ➔ Contracts & Signatures ➔ Milestones & Deliverables ➔ Invoices & Payments ➔ Messages Inbox.
  * Live Android execution validated on Pixel 8 (`emulator-5554`).
  * 100% Cloud Firestore sync verified across all 6 collections (`projects`, `clients`, `invoices`, `messages`, `deliverables`, `tasks`).
  * TypeScript validation: **0 errors** (`tsc --noEmit`).

---

## 📁 Repository File Structure
```text
├── README.md                                  # Production master documentation
├── FILE_MANIFEST.md                           # Master file & component manifest
├── IMPLEMENTATION_CHECKLIST.md                # 18-point verification matrix
├── package.json                               # Expo dependencies & scripts
├── app.json                                   # App configuration & deep links
├── tsconfig.json                              # TypeScript configuration
├── firestore.rules                            # Cloud Firestore security rules
└── src/
    ├── app/                                   # Expo Router Screens (Root Navigators)
    │   ├── _layout.tsx                        # Global Stack & Modal definitions
    │   ├── index.tsx                          # App splash entry
    │   ├── onboarding.tsx                     # 3-slide Onboarding carousel
    │   ├── home.tsx                           # Home dashboard screen
    │   ├── projects.tsx                       # Projects catalog
    │   ├── clients.tsx                        # Clients directory
    │   ├── finance.tsx                        # Finance & Invoices
    │   ├── messages.tsx                       # Messaging inbox
    │   ├── tasks.tsx                          # Tasks management
    │   ├── milestones.tsx                     # Milestones & Timeline
    │   ├── scope.tsx                          # Project scope baseline
    │   ├── contract-terms.tsx                 # Contract terms & clauses
    │   ├── contract-preview.tsx               # Master agreement preview
    │   ├── contract-review.tsx                # Contract review, sign & PDF
    │   ├── more.tsx                           # Account, preferences & settings
    │   ├── rubrics.tsx                        # All 4 members rubric hub
    │   └── auth/                              # Login, Register, AccountType, OTP
    ├── features/                              # Domain Feature Modules
    │   ├── auth/                              # Authentication & Credentials
    │   ├── clients/                           # Client Directory & Contacts
    │   ├── contracts/                         # Legal Terms & Digital Signatures
    │   ├── home/                              # Dashboards (Freelancer / Client)
    │   ├── invoices/                          # Invoices, Cashflow & Ledgers
    │   ├── messages/                          # Conversations & Chat Threads
    │   ├── onboarding/                        # Onboarding Walkthrough
    │   ├── payments/                          # Bank Slips & Payment Verification
    │   ├── projects/                          # Projects, Scope & Deliverables
    │   ├── reminders/                         # Calendar Agenda & Reminders
    │   ├── settings/                          # Profile, Branding & Team Admin
    │   └── tasks/                             # Task Checklists & Priorities
    ├── services/                              # Firebase, Storage & Export Services
    ├── components/                            # Reusable UI Primitives & Navigation
    ├── context/                               # Global State & Perspective Switcher
    ├── theme/                                 # Design System Tokens
    ├── types/                                 # Global TypeScript Models
    └── utils/                                 # Dates, Currency, Documents & Permissions
```
