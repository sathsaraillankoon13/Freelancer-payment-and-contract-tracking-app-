export type UserRole = 'freelancer' | 'team' | 'client';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  workspaceName?: string;
  agencyName?: string;
  agencyLead?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'lead' | 'archived';
  linkedUserId?: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'On Hold';
  progressPercentage: number;
  totalTasks: number;
  completedTasks: number;
  currentMilestone: string;
  milestoneRatio: string; // e.g. "2/4"
  dueDate: string; // formatted e.g. "30 Sep 2026"
  daysLeftText: string; // e.g. "4 days left" or "14 days left"
  currentFocus: string; // e.g. "Homepage review"
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  projectTitle: string;
  scheduledTime: string; // e.g. "9:00 AM"
  completed: boolean;
  order: number;
}

export interface MeetingItem {
  id: string;
  title: string;
  timeText: string; // e.g. "Today at 2:30 PM • Google Meet" or "Today, 2:30 PM • 30 min"
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  participants: string; // e.g. "Kasun & Senuri"
  participantInitials: string[];
  joinUrl?: string;
}

export interface DeliverableItem {
  id: string;
  projectId: string;
  projectTitle: string;
  deliverableName: string; // e.g. "Homepage Design • v2"
  fileName: string; // e.g. "Homepage-v2-final.fig"
  thumbnailUrl?: string;
  author: string;
  authorNote: string; // e.g. "Revised spice hero banner & CTAs"
  submittedText: string; // e.g. "Submitted today"
  status: 'action_required' | 'approved' | 'changes_requested';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PaymentSubmission {
  id: string;
  amount: number;
  submittedAt: string;
  status: 'pending_review' | 'verified' | 'rejected';
  referenceNumber: string;
  proofUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-014"
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  totalAmount: number; // e.g. 180000
  paidAmount: number; // sum of verified payments, e.g. 72000
  outstandingAmount: number; // e.g. 108000
  currency: string; // "LKR"
  dueDate: string; // "30 Sep 2026"
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  items: InvoiceItem[];
  payments: PaymentSubmission[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  authorName: string;
  fileName: string;
  fileSize: string; // e.g. "2.4 MB"
  timeAgo: string; // e.g. "2 hours ago"
  type: 'pdf' | 'figma' | 'image' | 'archive';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  type: 'message' | 'deliverable' | 'invoice' | 'payment';
}
