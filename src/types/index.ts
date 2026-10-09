export type UserRole = 'freelancer' | 'team' | 'client';
export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'collaborator';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  teamRole?: TeamMemberRole;
  workspaceId?: string;
  workspaceName?: string;
  agencyName?: string;
  agencyLead?: string;
  clientId?: string;
  phone?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
  currency?: string;
  reducedMotion?: boolean;
  notificationsEnabled?: boolean;
}

export interface FileAttachment {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface ClientContact {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'lead' | 'archived';
  isArchived?: boolean;
  linkedUserId?: string | null;
  outstandingBalance?: number;
  internalNotes?: string;
  initials?: string;
  billingAddress?: string;
  inviteCode?: string;
  invitationStatus?: 'pending' | 'accepted' | 'invited' | 'none';
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus =
  | 'Draft'
  | 'Pending'
  | 'In Progress'
  | 'Client Review'
  | 'Under Review'
  | 'Changes Requested'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled';

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'client_review'
  | 'approved'
  | 'completed'
  | 'changes_requested'
  | 'rejected';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: MilestoneStatus;
  order?: number;
  deliverableId?: string;
  amount?: number;
  reviewHistory?: any[];
}

export interface ProjectTerm {
  id: string;
  title: string;
  clause: string;
  category?: 'Scope & Revisions' | 'Payment & Late Fees' | 'Intellectual Property' | 'Termination' | 'General';
  isStandard?: boolean;
  createdAt?: string;
}

export interface ScopeChangeRequest {
  id: string;
  requestedBy: string;
  description: string;
  additionalBudget?: number;
  additionalDays?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Project {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  title: string;
  name?: string;
  coverImage?: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  clientUid?: string | null;
  status: ProjectStatus;
  progressPercentage: number;
  totalTasks: number;
  completedTasks: number;
  currentMilestone: string;
  milestoneRatio: string; // e.g. "2/4"
  dueDate: string; // formatted e.g. "30 Sep 2026"
  startDate?: string;
  budget?: number;
  currency?: string;
  priority?: 'Low' | 'Medium' | 'High';
  daysLeftText?: string;
  currentFocus?: string;
  scopeNotes?: string;
  revisionLimit?: number;
  usedRevisions?: number;
  isArchived?: boolean;
  proposedScopeChange?: any;
  assignedTeam?: string[];
  milestones?: Milestone[];
  terms?: ProjectTerm[];
  scopeChanges?: ScopeChangeRequest[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  projectId: string;
  clientUid?: string | null;
  title: string;
  projectTitle: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignee?: string;
  estimatedHours?: number;
  scheduledTime?: string;
  dueDate?: string;
  completed: boolean;
  order: number;
  priority?: 'Low' | 'Medium' | 'High';
  createdAt?: string;
  updatedAt?: string;
}

export interface MeetingItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  projectId?: string;
  clientId?: string;
  title: string;
  timeText: string;
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  participants: string;
  participantInitials: string[];
  joinUrl?: string;
}

export interface DeliverableHistoryItem {
  version: string;
  fileName: string;
  status: 'action_required' | 'approved' | 'changes_requested';
  submittedAt: string;
  clientFeedback?: string;
  attachment?: FileAttachment;
}

export interface DeliverableItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  projectId: string;
  clientUid?: string | null;
  projectTitle: string;
  deliverableName: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  version?: string;
  thumbnailUrl?: string;
  author: string;
  authorNote: string;
  submittedText: string;
  submittedAt?: string;
  status: 'action_required' | 'approved' | 'changes_requested';
  shareStatus?: 'shared' | 'internal' | 'restricted';
  shareUrl?: string;
  clientFeedback?: string;
  attachment?: FileAttachment;
  history?: DeliverableHistoryItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id?: string;
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
  attachment?: FileAttachment;
  proofAttachment?: string;
  proofNote?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  paymentMethod?: string;
}

export interface Invoice {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  invoiceNumber: string;
  projectId: string;
  projectTitle: string;
  clientId: string;
  clientName: string;
  clientUid?: string | null;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  issueDate?: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Void';
  items: InvoiceItem[];
  payments: PaymentSubmission[];
  subtotal?: number;
  discount?: number;
  taxAmount?: number;
  taxRate?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  clientUid?: string | null;
  invoiceId?: string;
  paymentId?: string;
  source?: 'payment' | 'manual' | 'expense';
  title: string;
  subtitle?: string;
  amount: number;
  type: 'income' | 'expense';
  currency: string;
  category: string;
  date: string;
  occurredAt?: string;
  receiptUrl?: string;
  attachment?: FileAttachment;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  clientId: string;
  projectId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId?: string;
  participantUids?: string[];
  text: string;
  timestamp: string;
  read: boolean;
  attachment?: FileAttachment;
  attachmentName?: string;
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: 'active' | 'pending' | 'inactive';
  assignedProjectIds: string[];
  linkedUserId?: string;
  phone?: string;
}

export interface CommentItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  targetType: 'project' | 'task' | 'deliverable';
  targetId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
  visibility: 'internal' | 'shared';
}

export interface ReminderItem {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  title: string;
  note?: string;
  dateTime: string;
  status: 'pending' | 'completed' | 'snoozed';
  snoozedUntil?: string;
  linkedType?: 'project' | 'invoice' | 'deliverable' | 'general';
  linkedId?: string;
  linkedTitle?: string;
  priority?: 'low' | 'medium' | 'high';
  notify?: boolean;
  type?: string;
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  ownerUid?: string;
  workspaceId?: string;
  recipientId?: string;
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  type: 'message' | 'deliverable' | 'invoice' | 'payment' | 'scope';
}

export interface RecentActivityItem {
  id: string;
  title: string;
  authorName: string;
  fileName: string;
  fileSize: string;
  timeAgo: string;
  type: 'pdf' | 'figma' | 'image' | 'archive';
}
