import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  User,
  UserRole,
  TeamMemberRole,
  Project,
  ProjectStatus,
  Milestone,
  ProjectTerm,
  ScopeChangeRequest,
  TaskItem,
  MeetingItem,
  DeliverableItem,
  Invoice,
  PaymentSubmission,
  ClientContact,
  TransactionItem,
  RecentActivityItem,
  AppNotification,
  ReminderItem,
  TeamMember,
  CommentItem,
  MessageItem,
  FileAttachment,
} from '@/types';
import {
  INITIAL_FREELANCER_USER,
  INITIAL_CLIENT_USER,
  INITIAL_COMPANY_USER,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETING,
  INITIAL_DELIVERABLE,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_REMINDERS,
} from '@/services/mockData';
import { StorageService } from '@/services/storage';
import { FirebaseService } from '@/services/firebaseService';
import { AuthService } from '@/services/authService';
import { TabName } from '@/components/navigation/BottomTabBar';
import { normalizePhoneNumber } from '@/utils/phone';
import { Alert } from 'react-native';

export type ModalType =
  | 'project_details'
  | 'create_project'
  | 'client_details'
  | 'add_client'
  | 'clients_directory'
  | 'create_invoice'
  | 'edit_invoice'
  | 'submit_payment'
  | 'submit_deliverable'
  | 'review_deliverable'
  | 'messages_thread'
  | 'reminders'
  | 'edit_profile'
  | 'team_management'
  | 'notification_center'
  | 'project_terms'
  | 'email_verification'
  | null;

export interface AppContextValue {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;

  // Modal navigation
  activeModal: ModalType;
  selectedProjectId: string | null;
  selectedClientId: string | null;
  selectedInvoiceId: string | null;
  selectedDeliverableId: string | null;
  lastCreatedClientId: string | null;
  openModal: (
    modal: ModalType,
    payload?: {
      projectId?: string;
      clientId?: string;
      invoiceId?: string;
      deliverableId?: string;
    }
  ) => void;
  closeModal: () => void;
  openCreateProjectModal: () => void;
  openProjectDetailsModal: (projectId: string) => void;
  openAddClientModal: (returnTo?: any) => void;
  openClientDetailsModal: (clientId: string) => void;
  openClientsDirectoryModal: () => void;
  openCreateInvoiceModal: () => void;
  openEditInvoiceModal: (invoiceId: string) => void;
  openSubmitPaymentModal: (invoiceId?: string) => void;
  openSubmitDeliverableModal: (projectId?: string) => void;
  openReviewDeliverableModal: (deliverableId?: string) => void;
  openMessagesThreadModal: (clientId: string) => void;
  openRemindersModal: () => void;
  openEditProfileModal: () => void;
  openTeamManagementModal: () => void;
  openNotificationCenterModal: () => void;
  openProjectTermsModal: (projectId?: string) => void;
  openEmailVerificationModal: (email?: string) => void;

  // Data
  clients: ClientContact[];
  projects: Project[];
  tasks: TaskItem[];
  invoices: Invoice[];
  transactions: TransactionItem[];
  deliverables: DeliverableItem[];
  messages: MessageItem[];
  meetings: MeetingItem[];
  activeMeeting: MeetingItem;
  deliverable: DeliverableItem;
  recentActivity: RecentActivityItem[];
  notifications: AppNotification[];
  teamMembers: TeamMember[];
  comments: CommentItem[];
  reminders: ReminderItem[];

  // CRUD Operations
  // Clients
  addClient: (clientData: Partial<ClientContact>) => ClientContact;
  updateClient: (clientId: string, updates: Partial<ClientContact>) => void;
  deleteClient: (clientId: string) => { success: boolean; reason?: string };
  archiveClient: (clientId: string, isArchived?: boolean) => void;
  inviteClient: (clientId: string) => void;

  // Projects
  addProject: (projectData: Partial<Project>) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  deleteProject: (projectId: string) => { success: boolean; reason?: string };
  archiveProject: (projectId: string, isArchived?: boolean) => void;
  requestScopeChange: (
    projectId: string,
    descriptionOrData: any,
    additionalBudget?: number,
    additionalDays?: number
  ) => void;
  respondScopeChange: (
    projectId: string,
    arg2: any,
    arg3?: any
  ) => void;

  // Tasks
  addTask: (
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;

  // Milestones
  addMilestone: (
    projectId: string,
    arg2: any,
    arg3?: any,
    arg4?: any
  ) => void;
  updateMilestone: (
    projectId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  deleteMilestone: (projectId: string, milestoneId: string) => void;
  reviewMilestone: (
    projectId: string,
    milestoneId: string,
    approved: boolean | string,
    feedback?: string
  ) => void;

  // Contract Terms (Member 1)
  addProjectTerm: (projectId: string, term: Partial<ProjectTerm>) => void;
  updateProjectTerm: (
    projectId: string,
    termId: string,
    updates: Partial<ProjectTerm>
  ) => void;
  deleteProjectTerm: (projectId: string, termId: string) => void;

  // Deliverables (Member 3)
  submitDeliverable: (
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any
  ) => void;
  reviewDeliverable: (
    deliverableId: string,
    action: any,
    feedback?: string
  ) => void;

  // Invoices & Payments (Member 2)
  addInvoice: (invoiceData: Partial<Invoice>) => Invoice;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => Invoice | null;
  deleteInvoice: (invoiceId: string) => { success: boolean; reason?: string };
  issueInvoice: (invoiceId: string) => void;
  voidInvoice: (invoiceId: string) => void;
  recordDirectPayment: (
    arg1: any,
    arg2?: any,
    arg3?: any
  ) => void;
  submitPayment: (
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any
  ) => void;
  verifyPayment: (submissionId: string) => void;
  rejectPayment: (submissionId: string, reason: string) => void;
  addTransaction: (transaction: Partial<TransactionItem>) => void;
  deleteTransaction: (transactionId: string) => void;

  // Messaging (Member 4)
  sendMessage: (
    arg1: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ) => void;

  // Comments
  addComment: (
    arg1: any,
    targetId?: string,
    text?: string,
    visibility?: 'internal' | 'shared'
  ) => void;
  deleteComment: (commentId: string) => void;

  // Reminders (Member 1)
  addReminder: (
    dataOrTitle: Partial<ReminderItem> | string,
    dateTime?: string,
    linkedType?: string,
    linkedId?: string,
    linkedTitle?: string,
    priority?: 'low' | 'medium' | 'high'
  ) => void;
  toggleReminder: (reminderId: string) => void;
  snoozeReminder: (reminderId: string, days?: number) => void;
  deleteReminder: (reminderId: string) => void;

  // Team
  inviteTeamMember: (
    name: string,
    email: string,
    role: TeamMemberRole,
    projectIds?: string[]
  ) => void;
  removeTeamMember: (memberId: string) => void;

  // Profile & Auth
  updateProfile: (updates: Partial<User>) => void;
  updateCompanyDetails: (updates: Partial<User>) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword: string, currentPassword?: string) => Promise<boolean>;

  // Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Permissions
  canManageTeam: boolean;
  canManageClients: boolean;
  canCreateProjects: boolean;
  canManageFinances: boolean;
  canReviewDeliverables: boolean;

  // Derived Metrics
  financialSummary: {
    received: number;
    expenses: number;
    netProfit: number;
    outstanding: number;
    total: number;
    currency: string;
    cashflowStatus: string;
  };
  metrics: {
    activeProjectsCount: number;
    totalClientsCount: number;
    upcomingDeadlinesCount: number;
    pendingTasksCount: number;
    awaitingReviewCount: number;
  };
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('freelancer');
  const [activeTab, setActiveTab] = useState<TabName>('home');

  // Navigation & Modals
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<
    string | null
  >(null);
  const [lastCreatedClientId, setLastCreatedClientId] = useState<string | null>(
    null
  );

  // Core Data - Initialize cleanly to prevent cross-account data leakage
  const [clients, setClients] = useState<ClientContact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // Profile states
  const [userOverrides, setUserOverrides] = useState<Partial<User>>({});

  // Compute Active User based on authenticated session or fallback
  const currentUser: User = useMemo(() => {
    if (userOverrides && userOverrides.id) {
      return {
        ...userOverrides,
        role: currentRole,
      } as User;
    }

    const base =
      currentRole === 'client'
        ? INITIAL_CLIENT_USER
        : currentRole === 'team'
        ? INITIAL_COMPANY_USER
        : INITIAL_FREELANCER_USER;
    return {
      ...base,
      ...userOverrides,
      role: currentRole,
    };
  }, [currentRole, userOverrides]);

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
  }, []);

  // Restore authenticated session on mount
  useEffect(() => {
    StorageService.loadSession().then((session) => {
      if (session) {
        setCurrentRole(session.role);
        setUserOverrides(session);

        // If specifically running the Kasun demo persona, ensure demo workspace is seeded
        if (session.id === 'usr_kasun_freelancer' && session.workspaceId) {
          FirebaseService.seedWorkspaceIfEmpty(session.workspaceId, {
            projects: INITIAL_PROJECTS,
            clients: INITIAL_CLIENTS,
            invoices: INITIAL_INVOICES,
            messages: [
              {
                id: 'msg_1',
                clientId: 'cl_senuri',
                projectId: 'prj_ceylonbites',
                senderId: 'usr_kasun',
                senderName: 'Kasun Perera',
                senderRole: 'freelancer',
                text: 'Hi Senuri, I have uploaded Homepage Design v2 with the spice hero update. Please review when convenient!',
                timestamp: 'Today at 10:18 AM',
                read: true,
                createdAt: new Date().toISOString(),
              },
              {
                id: 'msg_2',
                clientId: 'cl_senuri',
                projectId: 'prj_ceylonbites',
                senderId: 'usr_senuri_client',
                senderName: 'Senuri Perera',
                senderRole: 'client',
                text: 'Thanks Kasun! The palette looks fantastic. Reviewing the mobile navigation flow now.',
                timestamp: 'Today at 11:05 AM',
                read: true,
                createdAt: new Date().toISOString(),
              },
            ],
            deliverables: [INITIAL_DELIVERABLE],
            tasks: INITIAL_TASKS,
            transactions: INITIAL_TRANSACTIONS,
            reminders: INITIAL_REMINDERS,
          });
        }
      }
    });
  }, []);

  // Scoped Cloud Firestore Real-time Two-Way Sync
  useEffect(() => {
    if (!currentUser?.id) return;

    const scope = {
      workspaceId: currentUser.workspaceId || (currentUser.role === 'client' ? undefined : `ws_${currentUser.id}`),
      userRole: currentRole,
      userId: currentUser.id,
    };

    const unsubProjects = FirebaseService.subscribeProjects(scope, (items) => {
      setProjects(items);
    });
    const unsubClients = FirebaseService.subscribeClients(scope, (items) => {
      setClients(items);
    });
    const unsubInvoices = FirebaseService.subscribeInvoices(scope, (items) => {
      setInvoices(items);
    });
    const unsubMessages = FirebaseService.subscribeMessages(scope, (items) => {
      setMessages(items);
    });
    const unsubDeliverables = FirebaseService.subscribeDeliverables(scope, (items) => {
      setDeliverables(items);
    });
    const unsubTasks = FirebaseService.subscribeTasks(scope, (items) => {
      setTasks(items);
    });
    const unsubTransactions = FirebaseService.subscribeTransactions(scope, (items) => {
      setTransactions(items);
    });
    const unsubReminders = FirebaseService.subscribeReminders(scope, (items) => {
      setReminders(items);
    });
    const unsubComments = FirebaseService.subscribeComments(scope, (items) => {
      setComments(items);
    });

    return () => {
      unsubProjects();
      unsubClients();
      unsubInvoices();
      unsubMessages();
      unsubDeliverables();
      unsubTasks();
      unsubTransactions();
      unsubReminders();
      unsubComments();
    };
  }, [currentUser?.id, currentUser?.workspaceId, currentRole]);

  // Modal Open / Close Handlers
  const openModal = useCallback(
    (
      modal: ModalType,
      payload?: {
        projectId?: string;
        clientId?: string;
        invoiceId?: string;
        deliverableId?: string;
      }
    ) => {
      if (payload?.projectId) setSelectedProjectId(payload.projectId);
      if (payload?.clientId) setSelectedClientId(payload.clientId);
      if (payload?.invoiceId) setSelectedInvoiceId(payload.invoiceId);
      if (payload?.deliverableId)
        setSelectedDeliverableId(payload.deliverableId);
      setActiveModal(modal);
    },
    []
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openCreateProjectModal = useCallback(() => {
    setActiveModal('create_project');
  }, []);

  const openProjectDetailsModal = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveModal('project_details');
  }, []);

  const openAddClientModal = useCallback(() => {
    setActiveModal('add_client');
  }, []);

  const openClientDetailsModal = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setActiveModal('client_details');
  }, []);

  const openClientsDirectoryModal = useCallback(() => {
    setActiveModal('clients_directory');
  }, []);

  const openCreateInvoiceModal = useCallback(() => {
    if (currentRole === 'client') {
      Alert.alert('Access Restricted', 'Creating invoices is only permitted for freelancers and workspace owners.');
      return;
    }
    setActiveModal('create_invoice');
  }, [currentRole]);

  const openEditInvoiceModal = useCallback((invoiceId: string) => {
    if (currentRole === 'client') {
      Alert.alert('Access Restricted', 'Editing invoices is only permitted for freelancers and workspace owners.');
      return;
    }
    setSelectedInvoiceId(invoiceId);
    setActiveModal('edit_invoice');
  }, [currentRole]);

  const openSubmitPaymentModal = useCallback((invoiceId?: string) => {
    if (invoiceId) setSelectedInvoiceId(invoiceId);
    setActiveModal('submit_payment');
  }, []);

  const openSubmitDeliverableModal = useCallback((projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setActiveModal('submit_deliverable');
  }, []);

  const openReviewDeliverableModal = useCallback((deliverableId?: string) => {
    if (deliverableId) setSelectedDeliverableId(deliverableId);
    setActiveModal('review_deliverable');
  }, []);

  const openMessagesThreadModal = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setActiveModal('messages_thread');
  }, []);

  const openRemindersModal = useCallback(() => {
    setActiveModal('reminders');
  }, []);

  const openEditProfileModal = useCallback(() => {
    setActiveModal('edit_profile');
  }, []);

  const openTeamManagementModal = useCallback(() => {
    setActiveModal('team_management');
  }, []);

  const openNotificationCenterModal = useCallback(() => {
    setActiveModal('notification_center');
  }, []);

  const openProjectTermsModal = useCallback((projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setActiveModal('project_terms');
  }, []);

  const openEmailVerificationModal = useCallback((_email?: string) => {
    setActiveModal('email_verification');
  }, []);

  // CLIENT CRUD
  const addClient = useCallback(
    (clientData: Partial<ClientContact>): ClientContact => {
      const cleanPhone = clientData.phone ? normalizePhoneNumber(clientData.phone) : '';
      const newClient: ClientContact = {
        id: `cl_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        name: clientData.name || 'New Client',
        companyName: clientData.companyName || 'Company',
        email: (clientData.email || '').trim().toLowerCase(),
        phone: cleanPhone,
        status: clientData.status || 'active',
        isArchived: false,
        outstandingBalance: clientData.outstandingBalance || 0,
        internalNotes: clientData.internalNotes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setClients((prev) => [newClient, ...prev]);
      setLastCreatedClientId(newClient.id);
      FirebaseService.saveClient(newClient);
      return newClient;
    },
    [currentUser.id, currentUser.workspaceId]
  );

  const updateClient = useCallback(
    (clientId: string, updates: Partial<ClientContact>) => {
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.phone) {
        sanitizedUpdates.phone = normalizePhoneNumber(sanitizedUpdates.phone);
      }
      setClients((prev) => {
        const next = prev.map((c) => (c.id === clientId ? { ...c, ...sanitizedUpdates, updatedAt: new Date().toISOString() } : c));
        const updated = next.find((c) => c.id === clientId);
        if (updated) FirebaseService.saveClient(updated);
        return next;
      });
    },
    []
  );

  const deleteClient = useCallback((clientId: string) => {
    const hasProjects = projects.some((p) => p.clientId === clientId && !p.isArchived);
    if (hasProjects) {
      return {
        success: false,
        reason: 'This client has active projects linked to their account.',
      };
    }
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    FirebaseService.deleteClient(clientId);
    return { success: true };
  }, [projects]);

  const archiveClient = useCallback((clientId: string, isArchived = true) => {
    const shouldArchive = typeof isArchived === 'boolean' ? isArchived : true;
    setClients((prev) => {
      const next = prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              isArchived: shouldArchive,
              status: shouldArchive ? ('archived' as const) : ('active' as const),
            }
          : c
      );
      const updated = next.find((c) => c.id === clientId);
      if (updated) FirebaseService.saveClient(updated);
      return next;
    });
  }, []);

  const inviteClient = useCallback((clientId: string) => {
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId,
        title: 'Client Invited',
        message: `Portal invitation link dispatched to client.`,
        timeAgo: 'Just now',
        unread: false,
        type: 'message',
      },
      ...prev,
    ]);
  }, [currentUser.id, currentUser.workspaceId]);

  // PROJECT CRUD
  const addProject = useCallback(
    (projectData: Partial<Project>): Project => {
      const matchedClient = clients.find((c) => c.id === projectData.clientId);
      const clientName = matchedClient?.name || projectData.clientName || 'Client';
      const initials = clientName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const newProj: Project = {
        id: `prj_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        title: projectData.title || 'New Project',
        clientId: matchedClient ? matchedClient.id : (projectData.clientId || ''),
        clientName: clientName,
        clientInitials: initials,
        clientUid: matchedClient?.linkedUserId || null,
        coverImage: projectData.coverImage || undefined,
        status: projectData.status || 'In Progress',
        progressPercentage: projectData.progressPercentage || 0,
        totalTasks: projectData.totalTasks || 0,
        completedTasks: 0,
        currentMilestone: projectData.currentMilestone || 'Milestone 1',
        milestoneRatio: '0/1',
        dueDate: projectData.dueDate || '30 Nov 2026',
        startDate: projectData.startDate || '01 Nov 2026',
        budget: projectData.budget || 100000,
        currency: projectData.currency || 'LKR',
        priority: projectData.priority || 'Medium',
        daysLeftText: '30 days left',
        currentFocus: projectData.currentFocus || 'Project Kickoff',
        scopeNotes: projectData.scopeNotes || '',
        revisionLimit: projectData.revisionLimit || 3,
        usedRevisions: 0,
        assignedTeam: [currentUser.id],
        milestones: projectData.milestones || [
          {
            id: `ms_${Date.now()}_1`,
            title: 'Initial Deliverable & Review',
            dueDate: projectData.dueDate || '30 Nov 2026',
            status: 'pending',
            order: 1,
          },
        ],
        terms: projectData.terms || [
          {
            id: `trm_${Date.now()}_1`,
            title: 'Standard Revision Limit',
            clause:
              'Includes 3 revision rounds. Additional scope items billed separately.',
            category: 'Scope & Revisions',
            isStandard: true,
          },
        ],
        scopeChanges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProjects((prev) => [newProj, ...prev]);
      FirebaseService.saveProject(newProj);
      return newProj;
    },
    [clients, currentUser.id, currentUser.workspaceId]
  );

  const updateProject = useCallback(
    (projectId: string, updates: Partial<Project>) => {
      setProjects((prev) => {
        const next = prev.map((p) => (p.id === projectId ? { ...p, ...updates } : p));
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const updateProjectStatus = useCallback(
    (projectId: string, status: ProjectStatus) => {
      setProjects((prev) => {
        const next = prev.map((p) => (p.id === projectId ? { ...p, status } : p));
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
    FirebaseService.deleteProject(projectId);
    return { success: true };
  }, []);

  const archiveProject = useCallback((projectId: string, isArchived = true) => {
    setProjects((prev) => {
      const next = prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              isArchived: typeof isArchived === 'boolean' ? isArchived : true,
              status: isArchived ? ('Completed' as const) : ('In Progress' as const),
            }
          : p
      );
      const updated = next.find((p) => p.id === projectId);
      if (updated) FirebaseService.saveProject(updated);
      return next;
    });
  }, []);

  const requestScopeChange = useCallback(
    (
      projectId: string,
      descriptionOrData: any,
      additionalBudget?: number,
      additionalDays?: number
    ) => {
      const description =
        typeof descriptionOrData === 'string'
          ? descriptionOrData
          : descriptionOrData?.description || 'Scope modification';
      const budget =
        typeof descriptionOrData === 'object'
          ? descriptionOrData.budget
          : additionalBudget;
      const days =
        typeof descriptionOrData === 'object'
          ? descriptionOrData.days
          : additionalDays;

      const newScopeChange: ScopeChangeRequest = {
        id: `sc_${Date.now()}`,
        requestedBy: currentUser.name,
        description,
        additionalBudget: budget || 0,
        additionalDays: days || 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              scopeChanges: [newScopeChange, ...(p.scopeChanges || [])],
              proposedScopeChange: newScopeChange,
            };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });

      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Scope Change Requested',
          message: `${currentUser.name} requested changes to project scope.`,
          timeAgo: 'Just now',
          unread: true,
          type: 'scope',
        },
        ...prev,
      ]);
    },
    [currentUser.name]
  );

  const respondScopeChange = useCallback(
    (projectId: string, arg2: any, arg3?: any) => {
      const accepted =
        typeof arg2 === 'boolean'
          ? arg2
          : typeof arg3 === 'boolean'
          ? arg3
          : true;
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            const updated = (p.scopeChanges || []).map((sc) => ({
              ...sc,
              status: accepted ? ('accepted' as const) : ('rejected' as const),
            }));
            return {
              ...p,
              scopeChanges: updated,
              proposedScopeChange: undefined,
              usedRevisions: accepted
                ? (p.usedRevisions || 0) + 1
                : p.usedRevisions,
            };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  // TASK CRUD
  const addTask = useCallback(
    (
      arg1: any,
      arg2?: any,
      arg3?: any,
      arg4?: any,
      arg5?: any
    ) => {
      let projectId = 'prj_ceylonbites';
      let title = 'Project Task';
      let scheduledTime = 'Today';
      let priority: 'Low' | 'Medium' | 'High' = 'Medium';

      if (typeof arg1 === 'object') {
        projectId = arg1.projectId || projectId;
        title = arg1.title || title;
        scheduledTime = arg1.scheduledTime || arg1.time || scheduledTime;
        priority = arg1.priority || priority;
      } else if (projects.some((p) => p.id === arg1)) {
        // arg1 is projectId
        projectId = arg1;
        title = arg2 || 'Project Task';
        scheduledTime = arg3 || 'Today';
        priority = arg5 || arg4 || 'Medium';
      } else {
        // arg1 is title
        title = arg1;
        const matched = projects.find((p) => p.title === arg2);
        if (matched) projectId = matched.id;
        scheduledTime = arg3 || 'Today';
        priority = arg4 || 'Medium';
      }

      const activeProj = projects.find((p) => p.id === projectId);
      const newTask: TaskItem = {
        id: `tsk_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        clientUid: activeProj?.clientUid || null,
        projectId: activeProj ? activeProj.id : projectId,
        title,
        projectTitle: activeProj?.title || 'Project Task',
        description: typeof arg1 === 'object' ? arg1.description || '' : '',
        status: typeof arg1 === 'object' && arg1.status ? arg1.status : 'pending',
        assignee: typeof arg1 === 'object' ? arg1.assignee || currentUser.name : currentUser.name,
        estimatedHours: typeof arg1 === 'object' ? arg1.estimatedHours || 2 : 2,
        scheduledTime,
        dueDate: typeof arg1 === 'object' && arg1.dueDate ? arg1.dueDate : '2026-10-15',
        completed: typeof arg1 === 'object' && arg1.completed !== undefined ? arg1.completed : false,
        order: tasks.length + 1,
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      FirebaseService.saveTask(newTask);
    },
    [projects, tasks.length, currentUser.id, currentUser.name, currentUser.workspaceId]
  );

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const updated = next.find((t) => t.id === taskId);
      if (updated) FirebaseService.saveTask(updated);
      return next;
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    FirebaseService.deleteTask(taskId);
  }, []);

  const updateTask = useCallback(
    (taskId: string, updates: Partial<TaskItem>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
        const updated = next.find((t) => t.id === taskId);
        if (updated) FirebaseService.saveTask(updated);
        return next;
      });
    },
    []
  );

  // MILESTONE CRUD
  const addMilestone = useCallback(
    (projectId: string, arg2: any, arg3?: any, arg4?: any) => {
      let title = 'New Milestone';
      let dueDate = 'Next Month';
      let description = '';
      let amount = 0;

      if (typeof arg2 === 'object') {
        title = arg2.title || title;
        dueDate = arg2.dueDate || dueDate;
        description = arg2.description || description;
        amount = arg2.amount || amount;
      } else {
        title = arg2 || title;
        dueDate = arg3 || dueDate;
        description = arg4 || description;
      }

      const newMs: Milestone = {
        id: `ms_${Date.now()}`,
        title,
        description,
        dueDate,
        status: 'pending',
        order:
          (projects.find((p) => p.id === projectId)?.milestones?.length || 0) +
          1,
        amount,
        reviewHistory: [],
      };

      setProjects((prev) => {
        const next = prev.map((p) =>
          p.id === projectId
            ? { ...p, milestones: [...(p.milestones || []), newMs] }
            : p
        );
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    [projects]
  );

  const updateMilestone = useCallback(
    (projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            const updated = (p.milestones || []).map((m) =>
              m.id === milestoneId ? { ...m, ...updates } : m
            );
            return { ...p, milestones: updated };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const toggleMilestone = useCallback(
    (projectId: string, milestoneId: string) => {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            const updated = (p.milestones || []).map((m) =>
              m.id === milestoneId
                ? {
                    ...m,
                    status:
                      m.status === 'approved' || m.status === 'completed'
                        ? ('pending' as const)
                        : ('approved' as const),
                  }
                : m
            );
            return { ...p, milestones: updated };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const deleteMilestone = useCallback(
    (projectId: string, milestoneId: string) => {
      setProjects((prev) => {
        const next = prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                milestones: (p.milestones || []).filter(
                  (m) => m.id !== milestoneId
                ),
              }
            : p
        );
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const reviewMilestone = useCallback(
    (
      projectId: string,
      milestoneId: string,
      approved: boolean | string,
      feedback?: string
    ) => {
      const isApproved = approved === true || approved === 'approved';
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            const updated = (p.milestones || []).map((m) => {
              if (m.id === milestoneId) {
                const historyItem = {
                  action: isApproved ? 'approved' : 'changes_requested',
                  feedback:
                    feedback ||
                    (isApproved ? 'Milestone approved' : 'Revisions requested'),
                  timestamp: new Date().toISOString(),
                };
                return {
                  ...m,
                  status: isApproved
                    ? ('approved' as const)
                    : ('changes_requested' as const),
                  reviewHistory: [historyItem, ...(m.reviewHistory || [])],
                };
              }
              return m;
            });
            return { ...p, milestones: updated };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  // CONTRACT TERMS (Member 1 - Kumuditha Perera)
  const addProjectTerm = useCallback(
    (projectId: string, term: Partial<ProjectTerm>) => {
      const newTerm: ProjectTerm = {
        id: `trm_${Date.now()}`,
        title: term.title || 'New Clause',
        clause: term.clause || '',
        category: term.category || 'General',
        isStandard: term.isStandard || false,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => {
        const next = prev.map((p) =>
          p.id === projectId
            ? { ...p, terms: [...(p.terms || []), newTerm] }
            : p
        );
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const updateProjectTerm = useCallback(
    (projectId: string, termId: string, updates: Partial<ProjectTerm>) => {
      setProjects((prev) => {
        const next = prev.map((p) => {
          if (p.id === projectId) {
            const updated = (p.terms || []).map((t) =>
              t.id === termId ? { ...t, ...updates } : t
            );
            return { ...p, terms: updated };
          }
          return p;
        });
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  const deleteProjectTerm = useCallback(
    (projectId: string, termId: string) => {
      setProjects((prev) => {
        const next = prev.map((p) =>
          p.id === projectId
            ? { ...p, terms: (p.terms || []).filter((t) => t.id !== termId) }
            : p
        );
        const updated = next.find((p) => p.id === projectId);
        if (updated) FirebaseService.saveProject(updated);
        return next;
      });
    },
    []
  );

  // DELIVERABLES (Member 3 - Illankoon I.A.K.S)
  const submitDeliverable = useCallback(
    (
      arg1: any,
      arg2?: any,
      arg3?: any,
      arg4?: any
    ) => {
      let projectId = projects[0]?.id || '';
      let name = 'Homepage Deliverable';
      let notes = 'Ready for client review.';
      let fileName = 'Deliverable-file.pdf';
      let version = 'v1';
      let attachment: FileAttachment | undefined;

      if (typeof arg1 === 'object') {
        projectId = arg1.projectId || projectId;
        name = arg1.deliverableName || arg1.name || name;
        notes = arg1.authorNote || arg1.notes || notes;
        fileName = arg1.fileName || fileName;
        version = arg1.version || version;
        attachment = arg1.attachment;
      } else {
        projectId = arg1;
        name = arg2 || name;
        notes = arg3 || notes;
        attachment = arg4;
      }

      const activeProj =
        projects.find((p) => p.id === projectId) || projects[0];
      const newDel: DeliverableItem = {
        id: `del_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || (activeProj ? activeProj.workspaceId : `ws_${currentUser.id}`),
        clientUid: activeProj?.clientUid || null,
        projectId: activeProj?.id || projectId || '',
        projectTitle: activeProj?.title || 'Deliverable Review',
        deliverableName: name,
        fileName: attachment?.name || fileName,
        fileSize: attachment?.size
          ? `${(attachment.size / 1024 / 1024).toFixed(1)} MB`
          : '3.2 MB',
        fileType: attachment?.mimeType || 'Document',
        version,
        author: currentUser.name,
        authorNote: notes,
        submittedText: 'Submitted today',
        submittedAt:
          'Today at ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'action_required',
        attachment,
        history: [],
      };
      setDeliverables((prev) => [newDel, ...prev]);
      FirebaseService.saveDeliverable(newDel);

      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          ownerUid: currentUser.id,
          workspaceId: currentUser.workspaceId,
          title: 'Deliverable Submitted',
          message: `${name} uploaded for client approval.`,
          timeAgo: 'Just now',
          unread: true,
          type: 'deliverable',
        },
        ...prev,
      ]);
    },
    [currentUser.id, currentUser.name, currentUser.workspaceId, projects]
  );

  const reviewDeliverable = useCallback(
    (
      deliverableId: string,
      action: any,
      feedback?: string
    ) => {
      const isApproved = action === 'approve' || action === 'approved';
      setDeliverables((prev) => {
        const next = prev.map((d) => {
          if (d.id === deliverableId) {
            return {
              ...d,
              status: isApproved
                ? ('approved' as const)
                : ('changes_requested' as const),
              clientFeedback: feedback,
              history: [
                {
                  version: d.version || 'v1',
                  fileName: d.fileName,
                  status: isApproved
                    ? ('approved' as const)
                    : ('changes_requested' as const),
                  submittedAt: d.submittedAt || 'Today',
                  clientFeedback: feedback,
                },
                ...(d.history || []),
              ],
            };
          }
          return d;
        });
        const updated = next.find((d) => d.id === deliverableId);
        if (updated) FirebaseService.saveDeliverable(updated);
        return next;
      });

      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          ownerUid: currentUser.id,
          workspaceId: currentUser.workspaceId,
          title: isApproved
            ? 'Deliverable Approved'
            : 'Changes Requested',
          message:
            feedback ||
            (isApproved
              ? 'Client approved the deliverable.'
              : 'Client requested changes.'),
          timeAgo: 'Just now',
          unread: true,
          type: 'deliverable',
        },
        ...prev,
      ]);
    },
    [currentUser.id, currentUser.workspaceId]
  );

  // INVOICES & PAYMENTS (Member 2 - Nimnadi S.D.T)
  const addInvoice = useCallback(
    (invoiceData: Partial<Invoice>): Invoice => {
      const matchedClient =
        clients.find((c) => c.id === invoiceData.clientId) || clients[0];
      const matchedProj =
        projects.find((p) => p.id === invoiceData.projectId) || projects[0];

      const validItems = invoiceData.items && invoiceData.items.length > 0
        ? invoiceData.items
        : [
            {
              id: 'itm_1',
              description: 'Design & Development Retainer',
              quantity: 1,
              rate: invoiceData.totalAmount || 100000,
              amount: invoiceData.totalAmount || 100000,
            },
          ];

      const itemsSum = validItems.reduce(
        (sum, it) => sum + (Number(it.amount) || ((Number(it.quantity) || 1) * (Number(it.rate) || 0))),
        0
      );
      const subtotal = invoiceData.subtotal !== undefined
        ? invoiceData.subtotal
        : (itemsSum > 0 ? itemsSum : (invoiceData.totalAmount || 100000));
      const taxRate = invoiceData.taxRate || 0;
      const taxAmount = invoiceData.taxAmount !== undefined
        ? invoiceData.taxAmount
        : (taxRate > 0 ? (subtotal * taxRate) / 100 : 0);
      const discount = invoiceData.discount || 0;
      const calculatedTotal = Math.max(0, subtotal + taxAmount - discount);
      const totalAmount = invoiceData.totalAmount !== undefined
        ? invoiceData.totalAmount
        : calculatedTotal;
      const outstandingAmount = invoiceData.outstandingAmount !== undefined
        ? invoiceData.outstandingAmount
        : totalAmount;

      const newInv: Invoice = {
        id: `inv_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        clientUid: matchedClient?.linkedUserId || matchedProj?.clientUid || null,
        invoiceNumber:
          invoiceData.invoiceNumber || `INV-2026-0${invoices.length + 15}`,
        projectId: matchedProj?.id || invoiceData.projectId || '',
        projectTitle: matchedProj?.title || invoiceData.projectTitle || 'Project Retainer',
        clientId: matchedClient?.id || invoiceData.clientId || '',
        clientName: matchedClient?.name || invoiceData.clientName || 'Client',
        totalAmount,
        subtotal,
        discount,
        taxAmount,
        taxRate,
        paidAmount: 0,
        outstandingAmount,
        currency: invoiceData.currency || 'LKR',
        issueDate:
          invoiceData.issueDate ||
          new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        dueDate: invoiceData.dueDate || '30 Oct 2026',
        status: invoiceData.status || 'Draft',
        notes: invoiceData.notes || '',
        items: validItems,
        payments: [],
      };

      setInvoices((prev) => [newInv, ...prev]);
      FirebaseService.saveInvoice(newInv);
      return newInv;
    },
    [clients, currentUser.id, currentUser.workspaceId, invoices.length, projects]
  );

  const updateInvoice = useCallback(
    (invoiceId: string, updates: Partial<Invoice>) => {
      let updatedInv: Invoice | null = null;
      setInvoices((prev) => {
        const next = prev.map((inv) => {
          if (inv.id !== invoiceId) return inv;

          const client = updates.clientId ? clients.find((c) => c.id === updates.clientId) : null;
          const project = updates.projectId ? projects.find((p) => p.id === updates.projectId) : null;

          const newItems = updates.items || inv.items;
          const newSubtotal = updates.subtotal !== undefined
            ? updates.subtotal
            : newItems.reduce((s, it) => s + (it.quantity * it.rate), 0);
          const newTaxRate = updates.taxRate !== undefined ? updates.taxRate : (inv.taxRate || 0);
          const newTaxAmount = updates.taxAmount !== undefined
            ? updates.taxAmount
            : Math.round(newSubtotal * (newTaxRate / 100));
          const newDiscount = updates.discount !== undefined ? updates.discount : (inv.discount || 0);
          const newTotal = updates.totalAmount !== undefined
            ? updates.totalAmount
            : Math.max(0, newSubtotal + newTaxAmount - newDiscount);

          const paid = inv.paidAmount || 0;
          const remaining = Math.max(0, newTotal - paid);

          let newStatus = updates.status || inv.status;
          if (inv.status !== 'Draft' && inv.status !== 'Void') {
            if (remaining === 0 && paid > 0) {
              newStatus = 'Paid';
            } else if (paid > 0 && remaining > 0) {
              newStatus = 'Partially Paid';
            } else {
              newStatus = 'Sent';
            }
          }

          updatedInv = {
            ...inv,
            clientId: updates.clientId || inv.clientId,
            clientName: client?.name || (updates.clientName || inv.clientName),
            clientUid: client?.linkedUserId || project?.clientUid || (updates.clientUid !== undefined ? updates.clientUid : inv.clientUid),
            projectId: updates.projectId || inv.projectId,
            projectTitle: project?.title || (updates.projectTitle || inv.projectTitle),
            dueDate: updates.dueDate || inv.dueDate,
            items: newItems,
            subtotal: newSubtotal,
            taxRate: newTaxRate,
            taxAmount: newTaxAmount,
            discount: newDiscount,
            totalAmount: newTotal,
            outstandingAmount: remaining,
            notes: updates.notes !== undefined ? updates.notes : inv.notes,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };

          return updatedInv;
        });

        if (updatedInv) {
          FirebaseService.saveInvoice(updatedInv);
        }
        return next;
      });

      return updatedInv;
    },
    [clients, projects]
  );

  const deleteInvoice = useCallback((invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (inv && inv.status !== 'Draft' && inv.paidAmount > 0) {
      return {
        success: false,
        reason: 'Cannot delete invoice with recorded payments. Void it instead.',
      };
    }
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    FirebaseService.deleteInvoice(invoiceId);
    return { success: true };
  }, [invoices]);

  const issueInvoice = useCallback((invoiceId: string) => {
    setInvoices((prev) => {
      const next = prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Sent' as const } : i));
      const updated = next.find((i) => i.id === invoiceId);
      if (updated) FirebaseService.saveInvoice(updated);
      return next;
    });
  }, []);

  const voidInvoice = useCallback((invoiceId: string) => {
    setInvoices((prev) => {
      const next = prev.map((i) => (i.id === invoiceId ? { ...i, status: 'Void' as const } : i));
      const updated = next.find((i) => i.id === invoiceId);
      if (updated) FirebaseService.saveInvoice(updated);
      return next;
    });
  }, []);

  const recordDirectPayment = useCallback(
    (arg1: any, arg2?: any, arg3?: any) => {
      let invoiceId = '';
      let amount = 0;
      let method = 'Bank Transfer';

      if (typeof arg1 === 'object') {
        invoiceId = arg1.invoiceId;
        amount = arg1.amount;
        method = arg1.paymentMethod || arg1.method || method;
      } else {
        invoiceId = arg1;
        amount = arg2;
        method = arg3 || method;
      }

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      setInvoices((prev) => {
        const next = prev.map((i) => {
          if (i.id === invoiceId) {
            const paid = i.paidAmount + amount;
            const remaining = Math.max(0, i.totalAmount - paid);
            const newPayment = {
              id: `pay_${Date.now()}`,
              amount,
              submittedAt: dateStr,
              status: 'verified' as const,
              referenceNumber: `DIR-${Date.now().toString().slice(-6)}`,
              verifiedAt: now.toISOString(),
              paymentMethod: method,
            };
            return {
              ...i,
              paidAmount: paid,
              outstandingAmount: remaining,
              status: remaining === 0 ? ('Paid' as const) : ('Partially Paid' as const),
              payments: [...i.payments, newPayment],
            };
          }
          return i;
        });
        const updated = next.find((i) => i.id === invoiceId);
        if (updated) FirebaseService.saveInvoice(updated);
        return next;
      });

      const targetInv = invoices.find((i) => i.id === invoiceId);
      const newTx: TransactionItem = {
        id: `tx_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        clientUid: targetInv?.clientUid || null,
        invoiceId,
        source: 'payment',
        title: `Payment · ${targetInv?.clientName || 'Client'}`,
        subtitle: targetInv?.invoiceNumber,
        amount,
        type: 'income',
        currency: targetInv?.currency || 'LKR',
        category: 'Client payment',
        date: dateStr,
        occurredAt: now.toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      FirebaseService.saveTransaction(newTx);
    },
    [currentUser.id, currentUser.workspaceId, invoices]
  );

  const submitPayment = useCallback(
    (
      arg1: any,
      arg2?: any,
      arg3?: any,
      arg4?: any
    ) => {
      let invoiceId = '';
      let amount = 0;
      let referenceNumber = '';
      let attachment: FileAttachment | undefined;
      let proofAttachment: string | undefined;
      let proofNote: string | undefined;
      let paymentMethod = 'Bank Transfer';

      if (typeof arg1 === 'object') {
        invoiceId = arg1.invoiceId;
        amount = arg1.amount;
        referenceNumber = arg1.referenceNumber;
        attachment = arg1.proofAttachment?.uri ? arg1.proofAttachment : (arg1.attachment || undefined);
        proofAttachment = typeof arg1.proofAttachment === 'string' ? arg1.proofAttachment : arg1.proofAttachment?.uri;
        proofNote = arg1.proofNote;
        paymentMethod = arg1.paymentMethod || paymentMethod;
      } else {
        invoiceId = arg1;
        amount = arg2;
        referenceNumber = arg3;
        attachment = arg4;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const newSubmission: PaymentSubmission = {
        id: `pay_${Date.now()}`,
        amount,
        submittedAt: dateStr,
        status: 'pending_review' as const,
        referenceNumber,
        attachment,
        proofUrl: attachment?.uri || proofAttachment,
        proofAttachment,
        proofNote,
        paymentMethod,
      };

      setInvoices((prev) => {
        const next = prev.map((i) =>
          i.id === invoiceId
            ? { ...i, payments: [...i.payments, newSubmission] }
            : i
        );
        const updated = next.find((i) => i.id === invoiceId);
        if (updated) FirebaseService.saveInvoice(updated);
        return next;
      });

      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Payment Submitted',
          message: `LKR ${amount.toLocaleString()} payment submitted with reference ${referenceNumber}.`,
          timeAgo: 'Just now',
          unread: true,
          type: 'payment',
        },
        ...prev,
      ]);
    },
    []
  );

  const verifyPayment = useCallback(
    (submissionId: string) => {
      const now = new Date();
      let verifiedTx: TransactionItem | null = null;

      setInvoices((prev) => {
        const next = prev.map((inv) => {
          const sub = inv.payments.find((p) => p.id === submissionId);
          if (!sub || sub.status !== 'pending_review') return inv;

          const newPaid = inv.paidAmount + sub.amount;
          const newOutstanding = Math.max(0, inv.totalAmount - newPaid);

          verifiedTx = {
            id: `tx_${Date.now()}`,
            invoiceId: inv.id,
            paymentId: submissionId,
            source: 'payment',
            title: `Payment · ${inv.clientName}`,
            subtitle: inv.invoiceNumber,
            amount: sub.amount,
            type: 'income',
            currency: inv.currency,
            category: 'Client payment',
            date: now.toISOString().slice(0, 10),
            occurredAt: now.toISOString(),
          };

          return {
            ...inv,
            paidAmount: newPaid,
            outstandingAmount: newOutstanding,
            status:
              newOutstanding === 0
                ? ('Paid' as const)
                : ('Partially Paid' as const),
            payments: inv.payments.map((p) =>
              p.id === submissionId
                ? { ...p, status: 'verified' as const, verifiedAt: now.toISOString() }
                : p
            ),
          };
        });
        const target = next.find((inv) => inv.payments.some((p) => p.id === submissionId));
        if (target) FirebaseService.saveInvoice(target);
        return next;
      });

      if (verifiedTx) {
        setTransactions((prev) => [verifiedTx!, ...prev]);
        FirebaseService.saveTransaction(verifiedTx);
      }

      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Payment Verified',
          message: 'Payment verified and credited to workspace revenue.',
          timeAgo: 'Just now',
          unread: false,
          type: 'payment',
        },
        ...prev,
      ]);
    },
    []
  );

  const rejectPayment = useCallback(
    (submissionId: string, reason: string) => {
      setInvoices((prev) => {
        const next = prev.map((inv) => ({
          ...inv,
          payments: inv.payments.map((p) =>
            p.id === submissionId
              ? {
                  ...p,
                  status: 'rejected' as const,
                  rejectionReason: reason || 'Receipt verification failed',
                }
              : p
          ),
        }));
        const target = next.find((inv) => inv.payments.some((p) => p.id === submissionId));
        if (target) FirebaseService.saveInvoice(target);
        return next;
      });
    },
    []
  );

  const addTransaction = useCallback(
    (transaction: Partial<TransactionItem>) => {
      const now = new Date();
      const newTx: TransactionItem = {
        id: `tx_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        clientUid: null,
        source: transaction.source || 'expense',
        title: transaction.title || 'Expense Item',
        subtitle: transaction.subtitle,
        amount: transaction.amount || 0,
        type: transaction.type || 'expense',
        currency: transaction.currency || 'LKR',
        category: transaction.category || 'General',
        date: transaction.date || now.toISOString().slice(0, 10),
        occurredAt: now.toISOString(),
        attachment: transaction.attachment,
      };
      setTransactions((prev) => [newTx, ...prev]);
      FirebaseService.saveTransaction(newTx);
    },
    [currentUser.id, currentUser.workspaceId]
  );

  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    FirebaseService.deleteTransaction(transactionId);
  }, []);

  // MESSAGING (Member 4 - Silva S.T.S)
  const sendMessage = useCallback(
    (
      arg1: any,
      arg2?: any,
      arg3?: any,
      arg4?: any,
      arg5?: any
    ) => {
      let clientId = 'cl_senuri';
      let projectId: string | undefined;
      let text = '';
      let attachmentName: string | undefined;
      let attachment: FileAttachment | undefined;

      if (typeof arg1 === 'object') {
        clientId = arg1.clientId || clientId;
        projectId = arg1.projectId;
        text = arg1.text || '';
        attachmentName = arg1.attachmentName;
        attachment = arg1.attachment;
      } else if (arg4 !== undefined || arg5 !== undefined) {
        // Called as (clientId, projectId, text, attachmentName, attachment)
        clientId = arg1;
        projectId = arg2;
        text = arg3 || '';
        attachmentName = arg4;
        attachment = arg5;
      } else {
        // Called as (clientId, text, attachment)
        clientId = arg1;
        text = arg2 || '';
        attachment = arg3;
      }

      const newMsg: MessageItem = {
        id: `msg_${Date.now()}`,
        ownerUid: currentUser.id,
        workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
        participantUids: [currentUser.id, clientId],
        clientId,
        projectId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        text,
        timestamp: 'Just now',
        read: true,
        attachment,
        attachmentName,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      FirebaseService.saveMessage(newMsg);
    },
    [currentUser.id, currentUser.name, currentUser.role, currentUser.workspaceId]
  );

  // COMMENTS
  const addComment = useCallback(
    (
      arg1: any,
      targetId?: string,
      text?: string,
      visibility?: 'internal' | 'shared'
    ) => {
      let cmtTargetType: 'project' | 'task' | 'deliverable' = 'project';
      let cmtTargetId = projects[0]?.id || 'prj_ceylonbites';
      let cmtText = '';
      let cmtVisibility: 'internal' | 'shared' = 'internal';

      if (typeof arg1 === 'object') {
        cmtTargetType = arg1.targetType || 'project';
        cmtTargetId = arg1.targetId || cmtTargetId;
        cmtText = arg1.text || '';
        cmtVisibility = arg1.visibility || 'internal';
      } else {
        cmtTargetType = arg1;
        cmtTargetId = targetId || cmtTargetId;
        cmtText = text || '';
        cmtVisibility = visibility || 'internal';
      }

      const newCmt: CommentItem = {
        id: `cmt_${Date.now()}`,
        targetType: cmtTargetType,
        targetId: cmtTargetId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        text: cmtText,
        createdAt: new Date().toISOString(),
        visibility: cmtVisibility,
      };
      setComments((prev) => [...prev, newCmt]);
      FirebaseService.saveComment(newCmt);
    },
    [currentUser.id, currentUser.name, currentUser.role, projects]
  );

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    FirebaseService.deleteComment(commentId);
  }, []);

  // REMINDERS (Member 1 - Kumuditha Perera)
  const addReminder = useCallback(
    (
      dataOrTitle: Partial<ReminderItem> | string,
      dateTime?: string,
      linkedType?: string,
      linkedId?: string,
      linkedTitle?: string,
      priority?: 'low' | 'medium' | 'high'
    ) => {
      let newRem: ReminderItem;
      if (typeof dataOrTitle === 'object') {
        newRem = {
          id: `rem_${Date.now()}`,
          ownerUid: currentUser.id,
          workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
          title: dataOrTitle.title || 'Untitled Reminder',
          note: dataOrTitle.note,
          dateTime: dataOrTitle.dateTime || new Date().toISOString(),
          status: dataOrTitle.status || 'pending',
          linkedType: dataOrTitle.linkedType || 'general',
          linkedId: dataOrTitle.linkedId,
          linkedTitle: dataOrTitle.linkedTitle,
          priority: dataOrTitle.priority || 'medium',
          notify: dataOrTitle.notify !== false,
          type: dataOrTitle.type || 'general',
          createdAt: new Date().toISOString(),
        };
      } else {
        newRem = {
          id: `rem_${Date.now()}`,
          ownerUid: currentUser.id,
          workspaceId: currentUser.workspaceId || `ws_${currentUser.id}`,
          title: dataOrTitle,
          dateTime: dateTime || new Date().toISOString(),
          status: 'pending',
          linkedType: (linkedType as any) || 'general',
          linkedId,
          linkedTitle,
          priority: priority || 'medium',
          notify: true,
          createdAt: new Date().toISOString(),
        };
      }
      setReminders((prev) => [newRem, ...prev]);
      FirebaseService.saveReminder(newRem);
    },
    [currentUser.id, currentUser.workspaceId]
  );

  const toggleReminder = useCallback((reminderId: string) => {
    setReminders((prev) => {
      const next = prev.map((r) =>
        r.id === reminderId
          ? {
              ...r,
              status: r.status === 'completed' ? ('pending' as const) : ('completed' as const),
            }
          : r
      );
      const updated = next.find((r) => r.id === reminderId);
      if (updated) FirebaseService.saveReminder(updated);
      return next;
    });
  }, []);

  const snoozeReminder = useCallback((reminderId: string, days = 1) => {
    setReminders((prev) => {
      const next = prev.map((r) => {
        if (r.id === reminderId) {
          const nextDate = new Date(Date.now() + days * 86400000).toISOString();
          return { ...r, dateTime: nextDate };
        }
        return r;
      });
      const updated = next.find((r) => r.id === reminderId);
      if (updated) FirebaseService.saveReminder(updated);
      return next;
    });
  }, []);

  const deleteReminder = useCallback((reminderId: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    FirebaseService.deleteReminder(reminderId);
  }, []);

  // TEAM
  const inviteTeamMember = useCallback(
    (
      name: string,
      email: string,
      role: TeamMemberRole,
      projectIds?: string[]
    ) => {
      const newMember: TeamMember = {
        id: `tm_${Date.now()}`,
        workspaceId: 'ws_isaacify',
        name,
        email,
        role,
        status: 'pending',
        assignedProjectIds: projectIds || [],
      };
      setTeamMembers((prev) => [...prev, newMember]);
    },
    []
  );

  const removeTeamMember = useCallback((memberId: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  // PROFILE & AUTH
  const updateProfile = useCallback((updates: Partial<User>) => {
    setUserOverrides((prev) => {
      const next = { ...prev, ...updates };
      const full: User = { ...currentUser, ...next };
      FirebaseService.saveUser(full);
      StorageService.saveSession(full);
      return next;
    });
  }, [currentUser]);

  const updateCompanyDetails = useCallback((updates: Partial<User>) => {
    setUserOverrides((prev) => {
      const next = { ...prev, ...updates };
      const full: User = { ...currentUser, ...next };
      FirebaseService.saveUser(full);
      StorageService.saveSession(full);
      return next;
    });
  }, [currentUser]);

  const logout = useCallback(async () => {
    await AuthService.signOut();
    setUserOverrides({});
    setCurrentRole('freelancer');
  }, []);

  const resetPassword = useCallback(
    async (email: string, _newPassword?: string, _currentPassword?: string) => {
      const res = await AuthService.sendPasswordReset(email);
      return res.success;
    },
    []
  );

  // NOTIFICATIONS
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  // PERMISSIONS
  const canManageTeam = currentRole === 'team';
  const canManageClients = currentRole !== 'client';
  const canCreateProjects = currentRole !== 'client';
  const canManageFinances = currentRole !== 'client';
  const canReviewDeliverables = currentRole === 'client';

  // FINANCIAL SUMMARY
  const financialSummary = useMemo(() => {
    const received = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstanding = invoices.reduce(
      (sum, inv) => sum + inv.outstandingAmount,
      0
    );
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = received - expenses;

    return {
      received,
      expenses,
      netProfit,
      outstanding,
      total,
      currency: currentUser.currency || 'LKR',
      cashflowStatus: netProfit < 0 ? 'Deficit' : 'Healthy',
    };
  }, [invoices, transactions, currentUser.currency]);

  // DERIVED METRICS
  const metrics = useMemo(() => {
    const activeProjects =
      currentRole === 'client'
        ? projects.filter(
            (p) =>
              p.clientUid === currentUser.id ||
              (currentUser.clientId && p.clientId === currentUser.clientId)
          )
        : projects;

    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const awaitingReview = deliverables.filter(
      (d) => d.status === 'action_required'
    ).length;
    const upcomingDeadlines = projects.filter(
      (p) => p.status === 'In Progress' && !p.isArchived
    ).length;

    return {
      activeProjectsCount: activeProjects.length,
      totalClientsCount: clients.filter((c) => !c.isArchived).length,
      upcomingDeadlinesCount: upcomingDeadlines,
      pendingTasksCount: pendingTasks,
      awaitingReviewCount: awaitingReview,
    };
  }, [projects, tasks, deliverables, clients, currentRole, currentUser.id, currentUser.clientId]);

  const activeMeeting = meetings[0] || INITIAL_MEETING;
  const deliverable = deliverables[0] || INITIAL_DELIVERABLE;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        activeTab,
        setActiveTab,

        activeModal,
        selectedProjectId,
        selectedClientId,
        selectedInvoiceId,
        selectedDeliverableId,
        lastCreatedClientId,
        openModal,
        closeModal,
        openCreateProjectModal,
        openProjectDetailsModal,
        openAddClientModal,
        openClientDetailsModal,
        openClientsDirectoryModal,
        openCreateInvoiceModal,
        openEditInvoiceModal,
        openSubmitPaymentModal,
        openSubmitDeliverableModal,
        openReviewDeliverableModal,
        openMessagesThreadModal,
        openRemindersModal,
        openEditProfileModal,
        openTeamManagementModal,
        openNotificationCenterModal,
        openProjectTermsModal,
        openEmailVerificationModal,

        clients,
        projects,
        tasks,
        invoices,
        transactions,
        deliverables,
        messages,
        meetings,
        activeMeeting,
        deliverable,
        recentActivity,
        notifications,
        teamMembers,
        comments,
        reminders,

        addClient,
        updateClient,
        deleteClient,
        archiveClient,
        inviteClient,

        addProject,
        updateProject,
        updateProjectStatus,
        deleteProject,
        archiveProject,
        requestScopeChange,
        respondScopeChange,

        addTask,
        toggleTask,
        deleteTask,
        updateTask,

        addMilestone,
        updateMilestone,
        toggleMilestone,
        deleteMilestone,
        reviewMilestone,

        addProjectTerm,
        updateProjectTerm,
        deleteProjectTerm,

        submitDeliverable,
        reviewDeliverable,

        addInvoice,
        updateInvoice,
        deleteInvoice,
        issueInvoice,
        voidInvoice,
        recordDirectPayment,
        submitPayment,
        verifyPayment,
        rejectPayment,
        addTransaction,
        deleteTransaction,

        sendMessage,

        addComment,
        deleteComment,

        addReminder,
        toggleReminder,
        snoozeReminder,
        deleteReminder,

        inviteTeamMember,
        removeTeamMember,

        updateProfile,
        updateCompanyDetails,
        logout,
        resetPassword,

        markNotificationRead,
        markAllNotificationsRead,

        canManageTeam,
        canManageClients,
        canCreateProjects,
        canManageFinances,
        canReviewDeliverables,

        financialSummary,
        metrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
export default AppContext;
