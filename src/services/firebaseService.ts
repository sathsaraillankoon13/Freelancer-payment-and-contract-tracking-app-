import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import {
  Project,
  ClientContact,
  Invoice,
  TaskItem,
  DeliverableItem,
  MessageItem,
  TransactionItem,
  ReminderItem,
  CommentItem,
  User,
  UserRole,
} from '@/types';
import { normalizePhoneNumber } from '@/utils/phone';

export interface ScopeOptions {
  workspaceId?: string;
  userRole?: UserRole;
  userId?: string;
  clientId?: string;
}

type CallbackOrOptions<T> =
  | ScopeOptions
  | ((items: T[]) => void);

function normalizeParams<T>(
  firstArg?: CallbackOrOptions<T>,
  secondArg?: (items: T[]) => void
): { options: ScopeOptions; callback: (items: T[]) => void } {
  if (typeof firstArg === 'function') {
    return {
      options: {},
      callback: firstArg,
    };
  }
  return {
    options: firstArg || {},
    callback: secondArg || (() => {}),
  };
}

/**
 * Service to sync app collections with Cloud Firestore in real-time with strict multi-user scoping.
 */
export const FirebaseService = {
  // -------------------------------------------------------------
  // REAL-TIME SUBSCRIBERS (LISTENERS)
  // -------------------------------------------------------------

  /**
   * Listen to real-time changes in projects (scoped by workspaceId for freelancer, clientUid for client)
   */
  subscribeProjects(
    optionsOrCallback?: CallbackOrOptions<Project>,
    callbackArg?: (projects: Project[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'projects');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('clientUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Project)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeProjects error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in clients (scoped by workspaceId for freelancer)
   */
  subscribeClients(
    optionsOrCallback?: CallbackOrOptions<ClientContact>,
    callbackArg?: (clients: ClientContact[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'clients');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client') {
      if (options.userId) {
        q = query(colRef, where('linkedUserId', '==', options.userId));
      } else {
        callback([]);
        return () => {};
      }
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as ClientContact)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeClients error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in invoices (scoped by workspaceId for freelancer, clientUid for client)
   */
  subscribeInvoices(
    optionsOrCallback?: CallbackOrOptions<Invoice>,
    callbackArg?: (invoices: Invoice[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'invoices');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('clientUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Invoice)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeInvoices error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in messages
   */
  subscribeMessages(
    optionsOrCallback?: CallbackOrOptions<MessageItem>,
    callbackArg?: (messages: MessageItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'messages');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('participantUids', 'array-contains', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as MessageItem)
        );
        items.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeA - timeB;
        });
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeMessages error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in deliverables
   */
  subscribeDeliverables(
    optionsOrCallback?: CallbackOrOptions<DeliverableItem>,
    callbackArg?: (deliverables: DeliverableItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'deliverables');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('clientUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as DeliverableItem)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeDeliverables error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in tasks
   */
  subscribeTasks(
    optionsOrCallback?: CallbackOrOptions<TaskItem>,
    callbackArg?: (tasks: TaskItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'tasks');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('clientUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as TaskItem)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeTasks error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in transactions (expenses & payments)
   */
  subscribeTransactions(
    optionsOrCallback?: CallbackOrOptions<TransactionItem>,
    callbackArg?: (transactions: TransactionItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'transactions');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('clientUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as TransactionItem)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeTransactions error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in reminders
   */
  subscribeReminders(
    optionsOrCallback?: CallbackOrOptions<ReminderItem>,
    callbackArg?: (reminders: ReminderItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'reminders');
    let q: Query<DocumentData> = colRef;

    if (options.userRole === 'client' && options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    } else if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('ownerUid', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as ReminderItem)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeReminders error:', error);
        callback([]);
      }
    );
  },

  /**
   * Listen to real-time changes in comments
   */
  subscribeComments(
    optionsOrCallback?: CallbackOrOptions<CommentItem>,
    callbackArg?: (comments: CommentItem[]) => void
  ): Unsubscribe {
    const { options, callback } = normalizeParams(optionsOrCallback, callbackArg);
    const colRef = collection(db, 'comments');
    let q: Query<DocumentData> = colRef;

    if (options.workspaceId) {
      q = query(colRef, where('workspaceId', '==', options.workspaceId));
    } else if (options.userId) {
      q = query(colRef, where('authorId', '==', options.userId));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as CommentItem)
        );
        callback(items);
      },
      (error) => {
        console.warn('[FirebaseService] subscribeComments error:', error);
        callback([]);
      }
    );
  },

  // -------------------------------------------------------------
  // CRUD WRITES
  // -------------------------------------------------------------

  async saveProject(project: Project): Promise<void> {
    try {
      const docRef = doc(db, 'projects', project.id);
      const dataToSave = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveProject error:', error);
      throw error;
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.warn('[FirebaseService] deleteProject error:', error);
      throw error;
    }
  },

  async saveClient(client: ClientContact): Promise<void> {
    try {
      const docRef = doc(db, 'clients', client.id);
      const dataToSave = {
        ...client,
        phone: client.phone ? normalizePhoneNumber(client.phone) : '',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveClient error:', error);
      throw error;
    }
  },

  async deleteClient(clientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
      console.warn('[FirebaseService] deleteClient error:', error);
      throw error;
    }
  },

  async saveInvoice(invoice: Invoice): Promise<void> {
    try {
      const docRef = doc(db, 'invoices', invoice.id);
      const dataToSave = {
        ...invoice,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveInvoice error:', error);
      throw error;
    }
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
    } catch (error) {
      console.warn('[FirebaseService] deleteInvoice error:', error);
      throw error;
    }
  },

  async saveMessage(message: MessageItem): Promise<void> {
    try {
      const docRef = doc(db, 'messages', message.id);
      const participantUids = message.participantUids || [message.senderId];
      if (message.recipientId && !participantUids.includes(message.recipientId)) {
        participantUids.push(message.recipientId);
      }
      const dataToSave = {
        ...message,
        participantUids,
        createdAt: message.createdAt || new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveMessage error:', error);
      throw error;
    }
  },

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      console.warn('[FirebaseService] deleteMessage error:', error);
      throw error;
    }
  },

  async saveDeliverable(deliverable: DeliverableItem): Promise<void> {
    try {
      const docRef = doc(db, 'deliverables', deliverable.id);
      const dataToSave = {
        ...deliverable,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveDeliverable error:', error);
      throw error;
    }
  },

  async deleteDeliverable(deliverableId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'deliverables', deliverableId));
    } catch (error) {
      console.warn('[FirebaseService] deleteDeliverable error:', error);
      throw error;
    }
  },

  async saveTask(task: TaskItem): Promise<void> {
    try {
      const docRef = doc(db, 'tasks', task.id);
      const dataToSave = {
        ...task,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveTask error:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.warn('[FirebaseService] deleteTask error:', error);
      throw error;
    }
  },

  async saveTransaction(transaction: TransactionItem): Promise<void> {
    try {
      const docRef = doc(db, 'transactions', transaction.id);
      const dataToSave = {
        ...transaction,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveTransaction error:', error);
      throw error;
    }
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
    } catch (error) {
      console.warn('[FirebaseService] deleteTransaction error:', error);
      throw error;
    }
  },

  async saveReminder(reminder: ReminderItem): Promise<void> {
    try {
      const docRef = doc(db, 'reminders', reminder.id);
      const dataToSave = {
        ...reminder,
        createdAt: reminder.createdAt || new Date().toISOString(),
      };
      await setDoc(docRef, JSON.parse(JSON.stringify(dataToSave)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveReminder error:', error);
      throw error;
    }
  },

  async deleteReminder(reminderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
    } catch (error) {
      console.warn('[FirebaseService] deleteReminder error:', error);
      throw error;
    }
  },

  async saveComment(comment: CommentItem): Promise<void> {
    try {
      const docRef = doc(db, 'comments', comment.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(comment)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveComment error:', error);
      throw error;
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.warn('[FirebaseService] deleteComment error:', error);
      throw error;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, JSON.parse(JSON.stringify(user)), { merge: true });
    } catch (error) {
      console.warn('[FirebaseService] saveUser error:', error);
      throw error;
    }
  },

  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as User;
      }
      return null;
    } catch (error) {
      console.warn('[FirebaseService] getUser error:', error);
      return null;
    }
  },

  // -------------------------------------------------------------
  // FIREBASE STORAGE FILE UPLOAD
  // -------------------------------------------------------------
  async uploadDeliverableFile(
    projectId: string,
    fileName: string,
    uri: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }> {
    try {
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `deliverables/${projectId}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storage, storagePath);

      // Fetch blob from URI
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob, {
        contentType: mimeType || 'application/octet-stream',
      });

      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl, path: storagePath };
    } catch (err) {
      console.warn('[FirebaseService] uploadDeliverableFile error:', err);
      // Fallback: return uri directly if offline or sandbox restricted
      return { url: uri, path: uri };
    }
  },

  async uploadReceiptFile(
    invoiceId: string,
    fileName: string,
    uri: string,
    mimeType?: string
  ): Promise<{ url: string; path: string }> {
    try {
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `receipts/${invoiceId}/${Date.now()}_${cleanFileName}`;
      const storageRef = ref(storage, storagePath);

      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob, {
        contentType: mimeType || 'application/octet-stream',
      });

      const downloadUrl = await getDownloadURL(storageRef);
      return { url: downloadUrl, path: storagePath };
    } catch (err) {
      console.warn('[FirebaseService] uploadReceiptFile error:', err);
      return { url: uri, path: uri };
    }
  },

  // -------------------------------------------------------------
  // SEED SPECIFIC DEMO WORKSPACE (KASUN / DEMO ONLY)
  // -------------------------------------------------------------
  async seedWorkspaceIfEmpty(
    workspaceId: string,
    initialData: {
      projects: Project[];
      clients: ClientContact[];
      invoices: Invoice[];
      messages: MessageItem[];
      deliverables: DeliverableItem[];
      tasks: TaskItem[];
      transactions?: TransactionItem[];
      reminders?: ReminderItem[];
    }
  ): Promise<void> {
    try {
      const q = query(collection(db, 'projects'), where('workspaceId', '==', workspaceId));
      const projSnap = await getDocs(q);
      if (projSnap.empty) {
        console.log(`[FirebaseService] Seeding demo workspace ${workspaceId}...`);
        for (const p of initialData.projects) {
          await this.saveProject({ ...p, workspaceId });
        }
        for (const c of initialData.clients) {
          await this.saveClient({ ...c, workspaceId });
        }
        for (const i of initialData.invoices) {
          await this.saveInvoice({ ...i, workspaceId });
        }
        for (const m of initialData.messages) {
          await this.saveMessage({ ...m, workspaceId });
        }
        for (const d of initialData.deliverables) {
          await this.saveDeliverable({ ...d, workspaceId });
        }
        for (const t of initialData.tasks) {
          await this.saveTask({ ...t, workspaceId });
        }
        if (initialData.transactions) {
          for (const tx of initialData.transactions) {
            await this.saveTransaction({ ...tx, workspaceId });
          }
        }
        if (initialData.reminders) {
          for (const rem of initialData.reminders) {
            await this.saveReminder({ ...rem, workspaceId });
          }
        }
        console.log(`[FirebaseService] Demo workspace ${workspaceId} seeded successfully!`);
      } else {
        // Even if projects exist, ensure transactions collection is populated if empty
        if (initialData.transactions) {
          const txSnap = await getDocs(query(collection(db, 'transactions'), where('workspaceId', '==', workspaceId)));
          if (txSnap.empty) {
            console.log(`[FirebaseService] Seeding transactions for workspace ${workspaceId}...`);
            for (const tx of initialData.transactions) {
              await this.saveTransaction({ ...tx, workspaceId });
            }
          }
        }
      }
    } catch (error) {
      console.warn('[FirebaseService] seedWorkspaceIfEmpty warning:', error);
    }
  },
};
