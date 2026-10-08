# Freelancer Payment & Contract Tracking App

## Branch: `Milestone-and-Approval-Management`

**Component:** Milestone, Task & Deliverable Approval Management  
## Branch: `Contract-and-Scope-Management`

**Member:** Perera K.A (IT23567924)  
**Component:** Contract & Scope Management  
## Branch: `Invoice-and-Payment-Tracking`

**Component:** Invoice & Payment Tracking  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Deliverable & Approval Management** module (Parent Epic: **SCRUM-7 Deliverable & Approval Management**) for the ISAACIFY mobile application. It delivers complete two-way file deliverable uploading, deliverable file previewing, interactive milestone tracking, deliverable approvals & change request flows, task details administration, and deletion handling.

---

## 🚀 Assigned Jira Work Items & Implementation Details

### 🔹 SCRUM-43: Implement File Upload Screen
* **Source Files:**
  * `src/features/projects/components/SubmitDeliverableModal.tsx`
  * `src/services/attachments.ts`
* **Key Features:**
  * Integrated native file picker supporting document and design assets (PDF, ZIP, PNG, Figma exports up to 20MB) using Expo DocumentPicker.
  * Version labeling (`v1`, `v2`, `v3`, etc.) to track delivery iterations.
  * Note authoring for freelancer instructions and client delivery notes.
  * Instant linkage to the corresponding project and milestone.

---

### 🔹 SCRUM-44: Implement Deliverable File Preview Screen
* **Source Files:**
  * `src/features/projects/components/SubmitDeliverableModal.tsx`
  * `src/features/projects/components/ReviewDeliverableModal.tsx`
* **Key Features:**
  * Interactive deliverable file preview chip displaying file name, extension icon, and formatted byte size.
  * One-tap file preview and external sharing utilizing native `expo-sharing` and `expo-file-system`.
  * Visual verification for clients prior to executing approval or revision requests.

---

### 🔹 SCRUM-45: Implement Client Milestone Review Screen
* **Source Files:**
  * `src/features/projects/screens/MilestonesTimelineScreen.tsx`
  * `src/app/milestones.tsx`
* **Key Features:**
  * Interactive sequenced milestone roadmap displaying overall project completion percentage.
  * Live milestone statuses: `Pending`, `In Progress`, `Client Review`, `Approved`, and `Changes Requested`.
  * Due date tracking with countdown badges and status transition controls.
  * Inline `+ Add Milestone` creator allowing title, description, budget allocation, and target delivery dates.

---

### 🔹 SCRUM-46: Implement Deliverable Review Screen
* **Source Files:**
  * `src/features/projects/components/ReviewDeliverableModal.tsx`
* **Key Features:**
  * Client inspection portal for submitted deliverables with document inspection controls.
  * Two-way decision workflow:
    * **Approve Deliverable:** Automatically marks deliverable as approved and triggers subsequent milestone release.
    * **Request Changes:** Opens revision note entry enabling structured feedback submission back to the freelancer.
  * Audit log displaying revision history and client feedback threads.

---

### 🔹 SCRUM-39: Implement Tasks Screen
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
  * `src/app/tasks.tsx`
* **Key Features:**
  * Comprehensive task list with live search and multi-criteria filters (*All*, *Pending*, *In Progress*, *Completed*).
  * Direct project segmentation filter to isolate tasks by linked project.
  * Summary metrics bar showing total task volume, completed tasks, and in-progress tasks.
  * Interactive completion checkbox toggling with haptic feedback.

---

### 🔹 SCRUM-40: Implement Task Details Screen
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
* **Key Features:**
  * Detailed modal view displaying task title, full description, assigned project, priority level (*High*, *Medium*, *Low*), estimated hours, and due date.
  * In-place task editing modal with form pre-fill and input validation.

---

### 🔹 SCRUM-41: Implement Delete Task Flow
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
* **Key Features:**
  * Safe delete action with modal confirmation prompt to prevent accidental removals.
  * Automatic synchronization with Cloud Firestore (`tasks` collection) removing the task across all client and freelancer views.
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
    │   ├── milestones.tsx                     # Route: Milestones Timeline Screen
    │   └── tasks.tsx                          # Route: Tasks Screen
    ├── features/
    │   ├── projects/
    │   │   ├── screens/
    │   │   │   └── MilestonesTimelineScreen.tsx # SCRUM-45: Milestone Review Screen
    │   │   └── components/
    │   │       ├── SubmitDeliverableModal.tsx   # SCRUM-43 & 44: File Upload & Preview
    │   │       └── ReviewDeliverableModal.tsx   # SCRUM-46: Deliverable Review Screen
    │   └── tasks/
    │       └── screens/
    │           └── TasksScreen.tsx              # SCRUM-39, 40, 41: Tasks & Delete Flow
    └── services/
        ├── attachments.ts                     # Native document picker & attachment service
        ├── firebase.ts                        # Cloud Firestore initialization
        └── firebaseService.ts                 # Real-time Firestore sync listeners
```
