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
# Freelancer Payment and Contract Tracking App (ISAACIFY Mobile)

> **Main Branch — Common Application Core & Shared Foundation**  
> Mobile Application developed with **Expo (React Native)** and **TypeScript**.

---

## 📌 Project Architecture & Group Structure

This repository contains the mobile client for **ISAACIFY Freelancer CRM & Contract Management System**.  
The project is divided into **four dedicated member components**, each maintained on its respective Git branch, with the **`main` branch** serving as the **Common Project Core & Application Foundation**.

### 👥 Project Components & Feature Branches

| Component | Branch Name | Key Features |
|---|---|---|
| **01. Contract & Scope Management** | [`Contract-and-Scope-Management`](https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-/tree/Contract-and-Scope-Management) | Legal Terms, Scope Agreements, Contract Acceptance, PDF Export |
| **02. Payment & Invoice Management** | [`Invoice-and-Payment-Tracking`](https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-/tree/Invoice-and-Payment-Tracking) | Invoices, Cashflow Bar Chart, Payment Slips & Verification Ledger |
| **03. Milestone & Approval Management** | [`Milestone-and-Approval-Management`](https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-/tree/Milestone-and-Approval-Management) | Milestone Timelines, Deliverable Uploads (up to 20MB), Review & Change Requests |
| **04. Client & Project Management** | [`Client-and-Project-Management`](https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-/tree/Client-and-Project-Management) | Client Directory, Project Tracking, Task Checklists & Messaging |

---

## 🏛️ Main Branch: Common Application Core

The `main` branch houses the shared infrastructure and common screens utilized across all four member components:

### 1. 🔐 Authentication & Onboarding Flow
* **Splash Screen (`SplashScreen.tsx`):** Smooth branding initialization with logo animation.
* **Onboarding Carousel (`OnboardingScreen.tsx`):** 3-step value proposition walkthrough for new users.
* **Role Selection (`RoleSelectionScreen.tsx`):** Dual-role onboarding supporting **Individual Freelancers**, **Freelancer Agencies/Teams**, and **Clients**.
* **Sign In (`LoginScreen.tsx`):** Form validation, password visibility toggle, and developer quick-fill credentials.
* **Create Account (`RegisterScreen.tsx`):** Registration for Freelancers and Clients with immediate role assignment.
* **Password Reset (`ForgotPasswordScreen.tsx`):** Recovery instructions flow.

### 2. 🏠 Home Dashboard & Navigation Shell
* **Dual-View Dashboard (`HomeScreen.tsx`):** 
  * **Freelancer View (`FreelancerHomeView.tsx`):** Cashflow overview cards, active project shortcuts, and deadline reminders.
  * **Client View (`ClientHomeView.tsx`):** Project progress indicators, invoice alerts, and milestone updates.
* **Bottom Navigation Bar (`BottomTabBar.tsx`):** 5-tab responsive navigation with notification badging.
* **Notification Center (`NotificationCenterModal.tsx`):** Centralized alert history with unread badge counters.

### 3. ⚙️ Account & Settings
* **Settings Hub (`MoreSettingsScreen.tsx`):** Profile management, role indicator, and quick actions.
* **Edit Profile (`EditProfileModal.tsx`):** Agency branding, name, contact information, and currency preferences.
* **Team Management (`TeamManagementModal.tsx`):** Team member invitations and permissions.
* **Reminders (`RemindersModal.tsx`):** Calendar notifications and scheduled meetings.

### 4. 🎨 Design System & State Management
* **Design System:** Custom HSL/HEX color palette (`colors.ts`), 8pt grid spacing (`spacing.ts`), and DM Sans typography tokens (`typography.ts`).
* **State Management:** Reactive global state provider (`AppContext.tsx`) with cross-workspace isolation and storage persistence.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **Expo Go** app on Android/iOS or Android Emulator

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start Expo development server
npx expo start

# 3. Open on Android Emulator (Press 'a') or Web (Press 'w')
```
