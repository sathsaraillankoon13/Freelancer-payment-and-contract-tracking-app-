import type { User } from '../types';
import type { WorkspaceData } from '../services/storage';
import { deadlineLabel } from './dates';

export function scopeWorkspace(data: WorkspaceData, user: User | null): WorkspaceData {
  const empty: WorkspaceData = { clients: [], projects: [], tasks: [], invoices: [], transactions: [], deliverables: [], messages: [], meetings: [], notifications: [], teamMembers: [], comments: [], reminders: [] };
  if (!user) return empty;
  const owned = <T,>(records: T[] = []): T[] => (records || []).filter(r => !(r as any).workspaceId || (r as any).workspaceId === user.workspaceId);
  const clients = owned(data.clients);
  const member = user.role === 'team' && user.teamRole !== 'owner' && user.teamRole !== 'admin';
  const clientIds = new Set(clients.filter(c => c.id === user.clientId || c.id === user.id || c.linkedUserId === user.id || (c.email && c.email.toLowerCase() === user.email.toLowerCase())).map(c => c.id));
  const teamMember = data.teamMembers.find(m => m.linkedUserId === user.id || m.email.toLowerCase() === user.email.toLowerCase());
  const projects = owned(data.projects).filter(p => user.role === 'client' ? clientIds.has(p.clientId) : member ? p.assignedTeam?.some(id => id === user.id || id === user.name || id === teamMember?.id) || teamMember?.assignedProjectIds.includes(p.id) : true).map(p => ({ ...p, daysLeftText: deadlineLabel(p.dueDate) }));
  const projectIds = new Set(projects.map(p => p.id));
  const permittedClients = user.role === 'client' ? clients.filter(c => clientIds.has(c.id)).map(c => ({ ...c, internalNotes: undefined })) : member ? clients.filter(c => projects.some(p => p.clientId === c.id)).map(c => ({ ...c, internalNotes: undefined })) : clients;
  const provider = user.role !== 'client' && !member;

  const rawComments = owned(data.comments || []);
  const permittedComments = rawComments.filter(c => {
    if (user.role === 'client') {
      if (c.visibility !== 'shared') return false;
      return projectIds.has(c.targetId) || owned(data.deliverables).some(d => d.id === c.targetId && projectIds.has(d.projectId)) || owned(data.tasks).some(t => t.id === c.targetId && projectIds.has(t.projectId));
    }
    if (member) {
      return projectIds.has(c.targetId) || owned(data.deliverables).some(d => d.id === c.targetId && projectIds.has(d.projectId)) || owned(data.tasks).some(t => t.id === c.targetId && projectIds.has(t.projectId));
    }
    return true;
  });

  const rawReminders = owned(data.reminders || []);
  const permittedReminders = rawReminders.filter(r => {
    if (user.role === 'client') {
      return r.linkedId ? projectIds.has(r.linkedId) : false;
    }
    return true;
  });

  return {
    ...data,
    clients: permittedClients,
    projects,
    tasks: owned(data.tasks).filter(t => projectIds.has(t.projectId) && (user.role !== 'client')),
    invoices: member ? [] : owned(data.invoices).filter(i => user.role !== 'client' || (clientIds.has(i.clientId) && i.status !== 'Draft')),
    transactions: provider ? owned(data.transactions) : [],
    deliverables: owned(data.deliverables).filter(d => projectIds.has(d.projectId)),
    messages: owned(data.messages).filter(m => user.role === 'client' ? clientIds.has(m.clientId) : member ? !!m.projectId && projectIds.has(m.projectId) : true),
    meetings: owned(data.meetings).filter(m => provider || (m.projectId ? projectIds.has(m.projectId) : m.clientId ? clientIds.has(m.clientId) : false)),
    notifications: owned(data.notifications).filter(n => !n.recipientId ? provider : n.recipientId === user.id),
    teamMembers: provider ? owned(data.teamMembers) : [],
    comments: permittedComments,
    reminders: permittedReminders,
  };
}
