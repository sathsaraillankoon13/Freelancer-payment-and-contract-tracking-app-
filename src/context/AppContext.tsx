import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  User,
  UserRole,
  Project,
  TaskItem,
  MeetingItem,
  DeliverableItem,
  Invoice,
  RecentActivityItem,
  AppNotification,
} from '@/types';
import {
  INITIAL_FREELANCER_USER,
  INITIAL_CLIENT_USER,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETING,
  INITIAL_DELIVERABLE,
  INITIAL_INVOICE,
  INITIAL_RECENT_ACTIVITY,
  INITIAL_NOTIFICATIONS,
} from '@/services/mockData';

interface AppContextValue {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  projects: Project[];
  tasks: TaskItem[];
  toggleTask: (taskId: string) => void;
  addTask: (title: string, projectTitle: string, time: string) => void;
  activeMeeting: MeetingItem;
  deliverable: DeliverableItem;
  invoices: Invoice[];
  recentActivity: RecentActivityItem[];
  notifications: AppNotification[];
  // Derived metrics
  financialSummary: {
    received: number;
    outstanding: number;
    total: number;
    currency: string;
    cashflowStatus: string;
  };
  metrics: {
    activeProjectsCount: number;
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
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeMeeting] = useState<MeetingItem>(INITIAL_MEETING);
  const [deliverable, setDeliverable] = useState<DeliverableItem>(
    INITIAL_DELIVERABLE
  );
  const [invoices, setInvoices] = useState<Invoice[]>([INITIAL_INVOICE]);
  const [recentActivity] = useState<RecentActivityItem[]>(
    INITIAL_RECENT_ACTIVITY
  );
  const [notifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const currentUser = useMemo(() => {
    if (currentRole === 'client') {
      return INITIAL_CLIENT_USER;
    }
    return {
      ...INITIAL_FREELANCER_USER,
      role: currentRole,
    };
  }, [currentRole]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (title: string, projectTitle: string, time: string) => {
    const newTask: TaskItem = {
      id: `tsk_${Date.now()}`,
      projectId: 'prj_ceylonbites',
      title,
      projectTitle,
      scheduledTime: time,
      completed: false,
      order: tasks.length + 1,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Derive financial metrics directly from invoice & verified payment records
  const financialSummary = useMemo(() => {
    const received = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstanding = invoices.reduce(
      (sum, inv) => sum + inv.outstandingAmount,
      0
    );
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    return {
      received,
      outstanding,
      total,
      currency: 'LKR',
      cashflowStatus: 'Healthy',
    };
  }, [invoices]);

  const metrics = useMemo(() => {
    const activeProjects =
      currentRole === 'client'
        ? projects.filter((p) => p.clientId === 'usr_senuri')
        : projects;

    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const awaitingReview = deliverable.status === 'action_required' ? 1 : 0;

    return {
      activeProjectsCount: activeProjects.length,
      upcomingDeadlinesCount: 2,
      pendingTasksCount: pendingTasks,
      awaitingReviewCount: awaitingReview,
    };
  }, [projects, tasks, deliverable, currentRole]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        projects,
        tasks,
        toggleTask,
        addTask,
        activeMeeting,
        deliverable,
        invoices,
        recentActivity,
        notifications,
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
