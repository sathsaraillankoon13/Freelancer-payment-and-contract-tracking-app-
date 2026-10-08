# Freelancer Payment & Contract Tracking App

## Branch: `Milestone-and-Approval-Management`

**Component:** Milestone and Approval Management  
**Member:** Illankoon I.A.K.S (IT23554818)  
**Application:** ISAACIFY Freelancer CRM Mobile  

---

## 📌 Component Overview
This branch contains the official implementation of the **Deliverable Upload, Review & Milestone Approval** component for the ISAACIFY mobile application. It covers full lifecycle milestone progress tracking, native file picking and deliverable uploading, shared client file preview, structured deliverable approval and change request review workflows, and comprehensive task management.

---

## 🚀 Assigned Jira Work Items & Implementation Details

### 🔹 SCRUM-45: Implement Client Milestone Review Screen
* **Source Files:**
  * `src/features/projects/screens/MilestonesTimelineScreen.tsx`
  * `src/app/milestones.tsx`
* **Key Features:**
  * Interactive milestone timeline displaying sequential stages with due dates and real-time status pills (*Pending*, *In Review*, *Approved*, *Rejected*).
  * Direct action buttons to submit deliverables or trigger review approval workflows.
  * Milestone deletion with dependency safeguards protecting linked task records.

---

### 🔹 SCRUM-43: Implement File Upload Screen
* **Source Files:**
  * `src/features/projects/components/SubmitDeliverableModal.tsx`
  * `src/services/attachments.ts`
* **Key Features:**
  * Native document and image picker supporting up to 20MB file submissions.
  * Versioning tracking (*v1*, *v2*, *v3*) with deliverable notes and milestone linkage.
  * Progress upload indicator and Cloud Firestore deliverable synchronization.

---

### 🔹 SCRUM-44: Implement Deliverable File Preview Screen
* **Source Files:**
  * `src/features/projects/components/SubmitDeliverableModal.tsx`
  * `src/features/projects/components/ReviewDeliverableModal.tsx`
* **Key Features:**
  * File preview card with file extension badges (*PDF*, *PNG*, *FIG*, *ZIP*), human-readable byte sizes, and timestamps.
  * One-tap file opener using Expo Sharing and Linking.
  * Public client review web access indicator (`https://freelancer-app-d9103.web.app/deliverables/:id`).

---

### 🔹 SCRUM-46: Implement Deliverable Review Screen
* **Source Files:**
  * `src/features/projects/components/ReviewDeliverableModal.tsx`
* **Key Features:**
  * Dedicated review modal for clients to inspect submitted deliverable files and author notes.
  * Client decision controls: **Approve Deliverable** or **Request Changes**.
  * Instant status update reflecting on both Freelancer and Client view dashboards.

---

### 🔹 SCRUM-47: Complete Approval & Change Request Flow
* **Source Files:**
  * `src/features/projects/components/ReviewDeliverableModal.tsx`
  * `src/features/projects/screens/MilestonesTimelineScreen.tsx`
* **Key Features:**
  * Structured change request flow with mandatory revision feedback notes.
  * Automatic transition of milestone state back to provider queue upon change request.
  * Full audit trail logging review timestamps and client comments.

---

### 🔹 SCRUM-39: Implement Tasks Screen
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
  * `src/app/tasks.tsx`
* **Key Features:**
  * Task checklist directory categorized by project affiliation and status (*All*, *In Progress*, *Pending*, *Completed*).
  * Live search bar filtering by task title or description keywords.
  * Priority badges (*High*, *Medium*, *Low*) and dynamic completion progress bars.

---

### 🔹 SCRUM-40: Implement Task Details Screen
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
* **Key Features:**
  * Task inspection and editing: update title, priority, due date, and completion toggle.
  * Two-way data synchronization between task completions and project overall percentage.

---

### 🔹 SCRUM-41: Implement Delete Task Flow
* **Source Files:**
  * `src/features/tasks/screens/TasksScreen.tsx`
* **Key Features:**
  * Safe task deletion with instant confirmation and Cloud Firestore cleanup.

---

## 📁 Branch Structure
```text
├── README.md                                  # Documentation & Jira Mapping
├── FILE_MANIFEST.md                           # Detailed file index
└── src/
    ├── app/
    │   ├── milestones.tsx                     # Route: Milestones Timeline
    │   └── tasks.tsx                          # Route: Tasks Management
    ├── features/
    │   ├── projects/
    │   │   ├── screens/
    │   │   │   └── MilestonesTimelineScreen.tsx # SCRUM-45: Milestone Timeline
    │   │   └── components/
    │   │       ├── SubmitDeliverableModal.tsx # SCRUM-43 & 44: File Upload & Preview
    │   │       └── ReviewDeliverableModal.tsx # SCRUM-46 & 47: Approval & Change Requests
    │   └── tasks/
    │       └── screens/
    │           └── TasksScreen.tsx            # SCRUM-39, 40, 41: Tasks Management & Deletion
    └── services/
        ├── attachments.ts                     # File picker & native attachment helper
        ├── firebase.ts                        # Cloud Firestore initialization
        └── firebaseService.ts                 # Real-time Firestore sync listeners
```
