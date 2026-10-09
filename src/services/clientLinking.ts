import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizePhoneNumber } from '@/utils/phone';

export interface ClientLinkingResult {
  success: boolean;
  linkedClientsCount: number;
  linkedProjectsCount: number;
  linkedInvoicesCount: number;
  message: string;
}

/**
 * Service to link freelancer client contacts to verified registered ISAACIFY client accounts.
 * Security invariant: NEVER link based on unverified input. Must only be invoked after phone or email verification.
 */
export const ClientLinkingService = {
  /**
   * Securely link client contact records matching a verified phone number to the client's Firebase UID.
   */
  async linkClientByVerifiedPhone(
    clientUid: string,
    rawPhone: string
  ): Promise<ClientLinkingResult> {
    const canonicalPhone = normalizePhoneNumber(rawPhone);
    if (!canonicalPhone || !clientUid) {
      return {
        success: false,
        linkedClientsCount: 0,
        linkedProjectsCount: 0,
        linkedInvoicesCount: 0,
        message: 'Invalid phone or UID provided.',
      };
    }

    try {
      // 1. Query all client contacts with the matching canonical phone number
      const clientsCol = collection(db, 'clients');
      const qClients = query(clientsCol, where('phone', '==', canonicalPhone));
      const clientSnap = await getDocs(qClients);

      let linkedClientsCount = 0;
      let linkedProjectsCount = 0;
      let linkedInvoicesCount = 0;

      for (const clientDoc of clientSnap.docs) {
        const clientId = clientDoc.id;

        // Update client contact record with linked user UID
        await setDoc(
          doc(db, 'clients', clientId),
          {
            linkedUserId: clientUid,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        linkedClientsCount++;

        // 2. Query and update all projects assigned to this client contact
        const projectsCol = collection(db, 'projects');
        const qProjects = query(projectsCol, where('clientId', '==', clientId));
        const projectsSnap = await getDocs(qProjects);

        for (const projDoc of projectsSnap.docs) {
          const projId = projDoc.id;
          await setDoc(
            doc(db, 'projects', projId),
            {
              clientUid: clientUid,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          linkedProjectsCount++;

          // Update associated deliverables for this project
          const delivCol = collection(db, 'deliverables');
          const qDeliv = query(delivCol, where('projectId', '==', projId));
          const delivSnap = await getDocs(qDeliv);
          for (const dDoc of delivSnap.docs) {
            await setDoc(
              doc(db, 'deliverables', dDoc.id),
              { clientUid: clientUid, updatedAt: new Date().toISOString() },
              { merge: true }
            );
          }

          // Update associated tasks for this project
          const tasksCol = collection(db, 'tasks');
          const qTasks = query(tasksCol, where('projectId', '==', projId));
          const taskSnap = await getDocs(qTasks);
          for (const tDoc of taskSnap.docs) {
            await setDoc(
              doc(db, 'tasks', tDoc.id),
              { clientUid: clientUid, updatedAt: new Date().toISOString() },
              { merge: true }
            );
          }
        }

        // 3. Query and update all invoices assigned to this client contact
        const invoicesCol = collection(db, 'invoices');
        const qInvoices = query(invoicesCol, where('clientId', '==', clientId));
        const invoicesSnap = await getDocs(qInvoices);

        for (const invDoc of invoicesSnap.docs) {
          await setDoc(
            doc(db, 'invoices', invDoc.id),
            {
              clientUid: clientUid,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
          linkedInvoicesCount++;
        }
      }

      return {
        success: true,
        linkedClientsCount,
        linkedProjectsCount,
        linkedInvoicesCount,
        message: `Successfully linked ${linkedProjectsCount} project(s) and ${linkedInvoicesCount} invoice(s).`,
      };
    } catch (err: any) {
      console.warn('[ClientLinkingService] linkClientByVerifiedPhone error:', err);
      return {
        success: false,
        linkedClientsCount: 0,
        linkedProjectsCount: 0,
        linkedInvoicesCount: 0,
        message: err?.message || 'Error executing client linking.',
      };
    }
  },

  /**
   * Link client contacts matching a verified email address to the client's Firebase UID.
   */
  async linkClientByVerifiedEmail(
    clientUid: string,
    email: string
  ): Promise<ClientLinkingResult> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !clientUid) {
      return {
        success: false,
        linkedClientsCount: 0,
        linkedProjectsCount: 0,
        linkedInvoicesCount: 0,
        message: 'Invalid email or UID provided.',
      };
    }

    try {
      const clientsCol = collection(db, 'clients');
      const qClients = query(clientsCol, where('email', '==', cleanEmail));
      const clientSnap = await getDocs(qClients);

      let linkedClientsCount = 0;
      let linkedProjectsCount = 0;
      let linkedInvoicesCount = 0;

      for (const clientDoc of clientSnap.docs) {
        const clientId = clientDoc.id;

        await setDoc(
          doc(db, 'clients', clientId),
          {
            linkedUserId: clientUid,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        linkedClientsCount++;

        const projectsCol = collection(db, 'projects');
        const qProjects = query(projectsCol, where('clientId', '==', clientId));
        const projectsSnap = await getDocs(qProjects);

        for (const projDoc of projectsSnap.docs) {
          const projId = projDoc.id;
          await setDoc(
            doc(db, 'projects', projId),
            { clientUid: clientUid, updatedAt: new Date().toISOString() },
            { merge: true }
          );
          linkedProjectsCount++;

          const delivCol = collection(db, 'deliverables');
          const qDeliv = query(delivCol, where('projectId', '==', projId));
          const delivSnap = await getDocs(qDeliv);
          for (const dDoc of delivSnap.docs) {
            await setDoc(
              doc(db, 'deliverables', dDoc.id),
              { clientUid: clientUid, updatedAt: new Date().toISOString() },
              { merge: true }
            );
          }
        }

        const invoicesCol = collection(db, 'invoices');
        const qInvoices = query(invoicesCol, where('clientId', '==', clientId));
        const invoicesSnap = await getDocs(qInvoices);

        for (const invDoc of invoicesSnap.docs) {
          await setDoc(
            doc(db, 'invoices', invDoc.id),
            { clientUid: clientUid, updatedAt: new Date().toISOString() },
            { merge: true }
          );
          linkedInvoicesCount++;
        }
      }

      return {
        success: true,
        linkedClientsCount,
        linkedProjectsCount,
        linkedInvoicesCount,
        message: `Successfully linked ${linkedProjectsCount} project(s).`,
      };
    } catch (err: any) {
      console.warn('[ClientLinkingService] linkClientByVerifiedEmail error:', err);
      return {
        success: false,
        linkedClientsCount: 0,
        linkedProjectsCount: 0,
        linkedInvoicesCount: 0,
        message: err?.message || 'Error executing client email linking.',
      };
    }
  },
};
