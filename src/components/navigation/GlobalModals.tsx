import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ProjectDetailsModal } from '@/features/projects/components/ProjectDetailsModal';
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal';
import { ClientDetailsModal } from '@/features/clients/components/ClientDetailsModal';
import { AddClientModal } from '@/features/clients/components/AddClientModal';
import { ClientsDirectoryModal } from '@/features/clients/components/ClientsDirectoryModal';
import { CreateInvoiceModal } from '@/features/invoices/components/CreateInvoiceModal';
import { SubmitPaymentModal } from '@/features/payments/components/SubmitPaymentModal';
import { SubmitDeliverableModal } from '@/features/projects/components/SubmitDeliverableModal';
import { ReviewDeliverableModal } from '@/features/projects/components/ReviewDeliverableModal';
import { MessagesThreadModal } from '@/features/messages/components/MessagesThreadModal';
import { RemindersModal } from '@/features/reminders/components/RemindersModal';
import { EditProfileModal } from '@/features/settings/components/EditProfileModal';
import { TeamManagementModal } from '@/features/settings/components/TeamManagementModal';
import { NotificationCenterModal } from '@/features/home/components/NotificationCenterModal';
import { ProjectTermsModal } from '@/features/projects/components/ProjectTermsModal';

export const GlobalModals: React.FC = () => {
  const { activeModal } = useAppContext();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'project_details':
      return <ProjectDetailsModal />;
    case 'create_project':
      return <CreateProjectModal />;
    case 'client_details':
      return <ClientDetailsModal />;
    case 'add_client':
      return <AddClientModal />;
    case 'clients_directory':
      return <ClientsDirectoryModal />;
    case 'create_invoice':
      return <CreateInvoiceModal />;
    case 'submit_payment':
      return <SubmitPaymentModal />;
    case 'submit_deliverable':
      return <SubmitDeliverableModal />;
    case 'review_deliverable':
      return <ReviewDeliverableModal />;
    case 'messages_thread':
      return <MessagesThreadModal />;
    case 'reminders':
      return <RemindersModal />;
    case 'edit_profile':
      return <EditProfileModal />;
    case 'team_management':
      return <TeamManagementModal />;
    case 'notification_center':
      return <NotificationCenterModal />;
    case 'project_terms':
      return <ProjectTermsModal />;
    default:
      return null;
  }
};
