import {
  User,
  Project,
  TaskItem,
  MeetingItem,
  DeliverableItem,
  Invoice,
  RecentActivityItem,
  AppNotification,
} from '@/types';

export const INITIAL_FREELANCER_USER: User = {
  id: 'usr_kasun',
  name: 'Kasun Perera',
  firstName: 'Kasun',
  email: 'kasun@isaacify.io',
  role: 'freelancer',
  workspaceName: 'ISAACIFY Creative',
  agencyName: 'ISAACIFY Creative',
  agencyLead: 'Kasun',
};

export const INITIAL_CLIENT_USER: User = {
  id: 'usr_senuri',
  name: 'Senuri Perera',
  firstName: 'Senuri',
  email: 'senuri@ceylonbites.lk',
  role: 'client',
  workspaceName: 'CeylonBites Workspace',
  agencyName: 'ISAACIFY Creative',
  agencyLead: 'Kasun',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_ceylonbites',
    title: 'CeylonBites Brand & Website',
    clientId: 'usr_senuri',
    clientName: 'Senuri Perera',
    clientInitials: 'CB',
    status: 'In Progress',
    progressPercentage: 60,
    totalTasks: 10,
    completedTasks: 6,
    currentMilestone: 'Milestone 2 of 4',
    milestoneRatio: '2/4',
    dueDate: '30 Sep 2026',
    daysLeftText: '4 days left',
    currentFocus: 'Homepage review',
  },
  {
    id: 'prj_harbor',
    title: 'Harbor Studio Website',
    clientId: 'cl_harbor',
    clientName: 'David Lee',
    clientInitials: 'HS',
    status: 'In Progress',
    progressPercentage: 45,
    totalTasks: 8,
    completedTasks: 4,
    currentMilestone: 'Milestone 1 of 3',
    milestoneRatio: '1/3',
    dueDate: '15 Oct 2026',
    daysLeftText: '18 days left',
    currentFocus: 'Design system setup',
  },
  {
    id: 'prj_bloom',
    title: 'Bloom Creative E-Commerce',
    clientId: 'cl_bloom',
    clientName: 'Amara Fernando',
    clientInitials: 'BC',
    status: 'In Progress',
    progressPercentage: 80,
    totalTasks: 15,
    completedTasks: 12,
    currentMilestone: 'Milestone 4 of 4',
    milestoneRatio: '4/4',
    dueDate: '05 Oct 2026',
    daysLeftText: '8 days left',
    currentFocus: 'Checkout testing',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk_1',
    projectId: 'prj_ceylonbites',
    title: 'Review homepage',
    projectTitle: 'CeylonBites Brand & Website',
    scheduledTime: '9:00 AM',
    completed: false,
    order: 1,
  },
  {
    id: 'tsk_2',
    projectId: 'prj_harbor',
    title: 'Send project update',
    projectTitle: 'Harbor Studio Website',
    scheduledTime: '11:30 AM',
    completed: false,
    order: 2,
  },
  {
    id: 'tsk_3',
    projectId: 'prj_bloom',
    title: 'Prepare invoice',
    projectTitle: 'Bloom Creative',
    scheduledTime: '3:00 PM',
    completed: false,
    order: 3,
  },
];

export const INITIAL_MEETING: MeetingItem = {
  id: 'mtg_ceylonbites',
  title: 'CeylonBites review',
  timeText: 'Today at 2:30 PM • Google Meet',
  platform: 'Google Meet',
  participants: 'Kasun & Senuri',
  participantInitials: ['KF', 'SP'],
  joinUrl: 'https://meet.google.com/abc-isaacify-cb',
};

export const INITIAL_DELIVERABLE: DeliverableItem = {
  id: 'del_homepage_v2',
  projectId: 'prj_ceylonbites',
  projectTitle: 'CeylonBites Brand & Website',
  deliverableName: 'Homepage Design • v2',
  fileName: 'Homepage-v2-final.fig',
  thumbnailUrl: undefined,
  author: 'Kasun',
  authorNote: 'Revised spice hero banner & CTAs',
  submittedText: 'Submitted today',
  status: 'action_required',
};

export const INITIAL_INVOICE: Invoice = {
  id: 'inv_2026_014',
  invoiceNumber: 'INV-2026-014',
  projectId: 'prj_ceylonbites',
  projectTitle: 'CeylonBites Brand & Website',
  clientId: 'usr_senuri',
  clientName: 'Senuri Perera',
  totalAmount: 180000,
  paidAmount: 72000, // Verified payments sum
  outstandingAmount: 108000, // 180,000 - 72,000
  currency: 'LKR',
  dueDate: '30 Sep 2026',
  status: 'Partially Paid',
  items: [
    {
      id: 'itm_1',
      description: 'Brand Identity & Visual Guidelines',
      quantity: 1,
      rate: 80000,
      amount: 80000,
    },
    {
      id: 'itm_2',
      description: 'Responsive E-Commerce UI/UX Design (10 screens)',
      quantity: 1,
      rate: 100000,
      amount: 100000,
    },
  ],
  payments: [
    {
      id: 'pay_1',
      amount: 72000,
      submittedAt: '2026-09-15',
      status: 'verified',
      referenceNumber: 'HNB-TXN-902148',
    },
  ],
};

export const INITIAL_RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'act_1',
    title: 'Kasun shared Homepage-v2.pdf',
    authorName: 'Kasun',
    fileName: 'Homepage-v2.pdf',
    fileSize: '2.4 MB',
    timeAgo: '2 hours ago',
    type: 'pdf',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Homepage feedback',
    message: 'Senuri Perera added 3 notes on CeylonBites homepage.',
    timeAgo: '15m ago',
    unread: true,
    type: 'deliverable',
  },
  {
    id: 'notif_2',
    title: 'Payment Verified',
    message: 'Deposit of LKR 72,000 for INV-2026-014 verified.',
    timeAgo: '2h ago',
    unread: false,
    type: 'payment',
  },
];
