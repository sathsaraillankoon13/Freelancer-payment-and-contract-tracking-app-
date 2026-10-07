# File Manifest — Client & Project Management

**Component:** Client & Project Management  
**Branch:** `Client-and-Project-Management`  

| File Path | Description | Jira Story / Feature |
|---|---|---|
| `src/features/projects/screens/ProjectsScreen.tsx` | Projects catalog with search, status filters & progress bars | **SCRUM-57** |
| `src/app/projects.tsx` | Expo Router route handler for Projects screen | Route Handler |
| `src/features/home/components/ClientHomeView.tsx` | Dedicated client portal view for tracking project deliverables | **SCRUM-58** |
| `src/features/home/screens/HomeScreen.tsx` | Main home screen container coordinating role views | **SCRUM-58** |
| `src/app/home.tsx` | Expo Router route handler for Home | Route Handler |
| `src/features/projects/components/ProjectDetailsModal.tsx` | Multi-tab project details, scope, financials & delete flow | **SCRUM-59** & **SCRUM-60** |
| `src/features/projects/components/CreateProjectModal.tsx` | Project creator with budget, client selection & milestones | Project Management |
| `src/features/clients/screens/ClientsScreen.tsx` | Clients directory with search & active/archived filters | Client Directory CRUD |
| `src/app/clients.tsx` | Expo Router route handler for Clients screen | Route Handler |
| `src/features/clients/components/AddClientModal.tsx` | Form for adding clients with Quick Fill & validation | Client Directory CRUD |
| `src/features/clients/components/ClientDetailsModal.tsx` | Client profile, billing stats, projects & archive | Client Directory CRUD |
| `src/features/clients/components/ClientsDirectoryModal.tsx` | Directory picker modal for client selection | Client Directory CRUD |
| `src/features/messages/screens/MessagesScreen.tsx` | Messaging inbox with active conversations list | Communication |
| `src/app/messages.tsx` | Expo Router route handler for Messages | Route Handler |
| `src/features/messages/components/MessagesThreadModal.tsx` | Real-time chat conversation modal with timestamps | Communication |
| `src/features/home/components/FreelancerHomeView.tsx` | Freelancer overview dashboard with metrics | Dashboard |
| `src/features/settings/components/TeamManagementModal.tsx` | Team member roster administration & permissions | Team Management |
