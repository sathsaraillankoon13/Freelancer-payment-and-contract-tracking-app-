import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Project,
  ClientContact,
  Invoice,
  TaskItem,
  DeliverableItem,
  MessageItem,
} from '@/types';

/**
 * Service to sync app collections with Cloud Firestore in real-time
 */
export const FirebaseService = {
  // -------------------------------------------------------------
  // REAL-TIME SUBSCRIBERS (LISTENERS)
  // -------------------------------------------------------------

  /**
   * Listen to real-time changes in projects
   */
  subscribeProjects(callback: (projects: Project[]) => void): Unsubscribe {
    const colRef = collection(db, 'projects');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as Project)
          );
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeProjects error:', error);
      }
    );
  },

  /**
   * Listen to real-time changes in clients
   */
  subscribeClients(callback: (clients: ClientContact[]) => void): Unsubscribe {
    const colRef = collection(db, 'clients');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as ClientContact)
          );
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeClients error:', error);
      }
    );
  },

  /**
   * Listen to real-time changes in invoices
   */
  subscribeInvoices(callback: (invoices: Invoice[]) => void): Unsubscribe {
    const colRef = collection(db, 'invoices');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as Invoice)
          );
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeInvoices error:', error);
      }
    );
  },

  /**
   * Listen to real-time changes in messages
   */
  subscribeMessages(callback: (messages: MessageItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'messages');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MessageItem)
          );
          // Sort messages by createdAt or id
          items.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeA - timeB;
          });
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeMessages error:', error);
      }
    );
  },

  /**
   * Listen to real-time changes in deliverables
   */
  subscribeDeliverables(callback: (deliverables: DeliverableItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'deliverables');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as DeliverableItem)
          );
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeDeliverables error:', error);
      }
    );
  },

  /**
   * Listen to real-time changes in tasks
   */
  subscribeTasks(callback: (tasks: TaskItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'tasks');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as TaskItem)
          );
          callback(items);
        }
      },
      (error) => {
        console.warn('[FirebaseService] subscribeTasks error:', error);
      }
    );
  },

  // -------------------------------------------------------------
  // CRUD WRITES
  // -------------------------------------------------------------

  async saveProject(project: Project): Promise<void> {
    try {
      const docRef = doc(db, 'projects', project.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(project)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveProject error:', error);
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.warn('[FirebaseService] deleteProject error:', error);
    }
  },

  async saveClient(client: ClientContact): Promise<void> {
    try {
      const docRef = doc(db, 'clients', client.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(client)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveClient error:', error);
    }
  },

  async deleteClient(clientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      console.warn('[FirebaseService] deleteClient error:', error);
    }
  },

  async saveInvoice(invoice: Invoice): Promise<void> {
    try {
      const docRef = doc(db, 'invoices', invoice.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(invoice)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveInvoice error:', error);
    }
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
    } catch (error) {
      console.warn('[FirebaseService] deleteInvoice error:', error);
    }
  },

  async saveMessage(message: MessageItem): Promise<void> {
    try {
      const docRef = doc(db, 'messages', message.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(message)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveMessage error:', error);
    }
  },

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      console.warn('[FirebaseService] deleteMessage error:', error);
    }
  },

  async saveDeliverable(deliverable: DeliverableItem): Promise<void> {
    try {
      const docRef = doc(db, 'deliverables', deliverable.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(deliverable)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveDeliverable error:', error);
    }
  },

  async deleteDeliverable(deliverableId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'deliverables', deliverableId));
    } catch (error) {
      console.warn('[FirebaseService] deleteDeliverable error:', error);
    }
  },

  async saveTask(task: TaskItem): Promise<void> {
    try {
      const docRef = doc(db, 'tasks', task.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(task)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveTask error:', error);
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.warn('[FirebaseService] deleteTask error:', error);
    }
  },

  // -------------------------------------------------------------
  // INITIAL SEEDING HELPER
  // -------------------------------------------------------------
  async seedIfEmpty(initialData: {
    projects: Project[];
    clients: ClientContact[];
    invoices: Invoice[];
    messages: MessageItem[];
    deliverables: DeliverableItem[];
    tasks: TaskItem[];
  }): Promise<void> {
    try {
      const projSnap = await getDocs(collection(db, 'projects'));
      if (projSnap.empty) {
        console.log('[FirebaseService] Seeding initial data to Firestore...');
        for (const p of initialData.projects) {
          await this.saveProject(p);
        }
        for (const c of initialData.clients) {
          await this.saveClient(c);
        }
        for (const i of initialData.invoices) {
          await this.saveInvoice(i);
        }
        for (const m of initialData.messages) {
          await this.saveMessage(m);
        }
        for (const d of initialData.deliverables) {
          await this.saveDeliverable(d);
        }
        for (const t of initialData.tasks) {
          await this.saveTask(t);
        }
        console.log('[FirebaseService] Initial data seeded successfully!');
      }
    } catch (error) {
      console.warn('[FirebaseService] seedIfEmpty warning:', error);
    }
  },
};
