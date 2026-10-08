# Freelancer Payment & Contract Tracking App

## Branch: `Client-and-Project-Management`

**Component:** Client & Project Management  
**Member:** Silva S.T.S (IT23550780)  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Client & Project Management** component for the ISAACIFY mobile application. It covers full project lifecycle management, interactive client directory, contact management, real-time messaging conversations, safe entity deletion audits, and team administration.

---

## 🚀 Assigned Jira Work Items & Implementation Details

### 🔹 SCRUM-57: Implement My Projects Screen
* **Source Files:**
  * `src/features/projects/screens/ProjectsScreen.tsx`
  * `src/app/projects.tsx`
* **Key Features:**
  * Active projects catalog with real-time status filter tabs (*All*, *In Progress*, *Under Review*, *Completed*).
  * Live search input filtering across project titles and assigned client companies.
  * Direct action buttons to create projects, launch tasks, inspect scope, and access contract tools.

---

### 🔹 SCRUM-58: Implement Client Project Details Screen & Home Portals
* **Source Files:**
  * `src/features/projects/components/ProjectDetailsModal.tsx`
  * `src/features/home/components/FreelancerHomeView.tsx`
  * `src/features/home/components/ClientHomeView.tsx`
  * `src/features/home/screens/HomeScreen.tsx`
  * `src/app/home.tsx`
* **Key Features:**
  * Comprehensive multi-tab project inspection modal: Overview, Milestones, Tasks, Comments, and Deliverables.
  * Interactive project status switcher (Draft, In Progress, Review, Completed, On Hold).
  * Two-way synchronization between project completions and provider/client home views.

---

### 🔹 SCRUM-59: Project Creation / Edit Modal
* **Source Files:**
  * `src/features/projects/components/CreateProjectModal.tsx`
* **Key Features:**
  * Multi-field project configuration: project title, client contact selector, budget with currency formatting, priority level, and delivery dates.
  * Initial milestone setup and team member allocation.
  * **⚡ Quick Fill** button for instant testing and presentation.

---

### 🔹 SCRUM-60: Safe Project Deletion & Progress Tracking
* **Source Files:**
  * `src/features/projects/components/ProjectDetailsModal.tsx`
* **Key Features:**
  * Safe project deletion dialog: validates that projects with active invoices or verified payments cannot be accidentally deleted.
  * Dynamic task progress calculator: computes completion percentage (`completed / total * 100`) in real time.

---

### 🔹 SCRUM-61: Complete Client Creation & Communication Flow
* **Source Files:**
  * `src/features/clients/screens/ClientsScreen.tsx`
  * `src/features/clients/components/AddClientModal.tsx`
  * `src/features/clients/components/ClientDetailsModal.tsx`
  * `src/features/clients/components/ClientsDirectoryModal.tsx`
  * `src/features/messages/screens/MessagesScreen.tsx`
  * `src/features/messages/components/MessagesThreadModal.tsx`
  * `src/app/clients.tsx`
  * `src/app/messages.tsx`
* **Key Features:**
  * Complete client contact creation workflow with name, company, email, phone, billing address, and internal notes.
  * Live client directory with status filtering (*All*, *Active*, *Archived*) and financial summaries.
  * Real-time conversation thread modal with message composer, delivery timestamps, and multi-user perspective support.

---

## 📁 Branch Structure
```text
├── README.md                                  # Documentation & Jira Mapping
├── FILE_MANIFEST.md                           # Detailed file index
└── src/
    ├── app/
    │   ├── projects.tsx                       # Route: Projects
    │   ├── clients.tsx                        # Route: Clients Directory
    │   ├── messages.tsx                       # Route: Messages
    │   └── home.tsx                           # Route: Home Dashboard
    ├── features/
    │   ├── projects/
    │   │   ├── screens/
    │   │   │   └── ProjectsScreen.tsx         # SCRUM-57: Projects Screen
    │   │   └── components/
    │   │       ├── CreateProjectModal.tsx     # SCRUM-59: Create Project Modal
    │   │       └── ProjectDetailsModal.tsx    # SCRUM-58, 60: Project Details & Safe Deletion
    │   ├── clients/
    │   │   ├── screens/
    │   │   │   └── ClientsScreen.tsx          # SCRUM-61: Clients Directory Screen
    │   │   └── components/
    │   │       ├── AddClientModal.tsx         # SCRUM-61: Add Client Modal
    │   │       ├── ClientDetailsModal.tsx     # Client Details & Billing Modal
    │   │       └── ClientsDirectoryModal.tsx  # Client Selector Modal
    │   ├── messages/
    │   │   ├── screens/
    │   │   │   └── MessagesScreen.tsx         # SCRUM-61: Messages Inbox
    │   │   └── components/
    │   │       └── MessagesThreadModal.tsx    # SCRUM-61: Chat Conversation Thread
    │   ├── home/
    │   │   ├── screens/
    │   │   │   └── HomeScreen.tsx             # Root home screen
    │   │   └── components/
    │   │       ├── FreelancerHomeView.tsx     # Freelancer dashboard overview
    │   │       └── ClientHomeView.tsx         # Client dashboard portal
    │   └── settings/
    │       └── components/
    │           └── TeamManagementModal.tsx    # Team member administration
    └── services/
        ├── firebase.ts                        # Cloud Firestore initialization
        └── firebaseService.ts                 # Real-time Firestore sync listeners
```
