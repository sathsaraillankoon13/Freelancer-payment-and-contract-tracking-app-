import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { hashPassword } from './credentials';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Project,
  TaskItem,
  MeetingItem,
  DeliverableItem,
  Invoice,
  ClientContact,
  TransactionItem,
  AppNotification,
  MessageItem,
  TeamMember,
  CommentItem,
  ReminderItem,
} from '@/types';
import {
  INITIAL_COMPANY_USER,
  INITIAL_FREELANCER_USER,
  INITIAL_CLIENT_USER,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETING,
  INITIAL_DELIVERABLE,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const SECURE_SESSION_KEY = 'isaacify_session_id';
const writes = new Map<string, Promise<void>>();
let accountsLoading: Promise<AuthAccount[]> | null = null;
const SESSION_KEY = '@isaacify_current_session';
const ACCOUNTS_KEY = '@isaacify_accounts';
const WORKSPACE_DATA_PREFIX = '@isaacify_ws_';

export interface AuthAccount {
  id: string;
  email: string;
  password?: string; // Legacy credentials are migrated to a salted hash.
  passwordHash?: string;
  passwordSalt?: string;
  user: User;
}

export interface WorkspaceData {
  invoiceSequence?: number;
  clients: ClientContact[];
  projects: Project[];
  tasks: TaskItem[];
  invoices: Invoice[];
  transactions: TransactionItem[];
  deliverables: DeliverableItem[];
  messages: MessageItem[];
  meetings: MeetingItem[];
  notifications: AppNotification[];
  teamMembers: TeamMember[];
  comments?: CommentItem[];
  reminders?: ReminderItem[];
}

// Initial fixture accounts for testing roles if fresh install
export const SEED_ACCOUNTS: AuthAccount[] = [
  {
    id: 'usr_isaacify_company',
    email: 'isaacify.info@gmail.com',
    password: 'isaac123',
    user: {
      ...INITIAL_COMPANY_USER,
      workspaceId: 'ws_isaacify',
      teamRole: 'owner',
    },
  },
  {
    id: 'usr_kasun_freelancer',
    email: 'kasun@design.io',
    password: 'kasun123',
    user: {
      ...INITIAL_FREELANCER_USER,
      workspaceId: 'ws_kasun',
    },
  },
  {
    id: 'usr_senuri_client',
    email: 'senuri@ceylonbites.lk',
    password: 'senuri123',
    user: {
      ...INITIAL_CLIENT_USER,
      workspaceId: 'ws_isaacify',
    },
  },
];

export const createEmptyWorkspaceData = (): WorkspaceData => ({
  clients: [],
  projects: [],
  tasks: [],
  invoices: [],
  transactions: [],
  deliverables: [],
  messages: [],
  meetings: [],
  notifications: [],
  teamMembers: [],
  comments: [],
  reminders: [],
});

export const StorageService = {
  // Session
  async loadSession(): Promise<User | null> {
    const raw = Platform.OS === 'web' ? await AsyncStorage.getItem(SESSION_KEY) : await SecureStore.getItemAsync(SECURE_SESSION_KEY);
    const legacy = !raw && Platform.OS !== 'web' ? await AsyncStorage.getItem(SESSION_KEY) : null;
    const identity = raw ? JSON.parse(raw) : legacy ? JSON.parse(legacy) : null;
    if (!identity) return null;
    const storedAccounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
    const accounts: AuthAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];
    const account = accounts.find(a => a.user.id === identity.id);
    if (!account) { await this.saveSession(null); return null; }
    if (legacy) await this.saveSession(account.user);
    return account.user;
  },
  async saveSession(user: User | null): Promise<void> {
    if (Platform.OS === 'web') {
      if (user) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }));
      else await AsyncStorage.removeItem(SESSION_KEY);
      return;
    }
    if (user) await SecureStore.setItemAsync(SECURE_SESSION_KEY, JSON.stringify({ id: user.id }));
    else await SecureStore.deleteItemAsync(SECURE_SESSION_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  // Accounts
  async loadAccounts(): Promise<AuthAccount[]> {
    if (accountsLoading) return accountsLoading;
    accountsLoading = (async () => {
      const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
      const stored: AuthAccount[] = raw ? JSON.parse(raw) : (__DEV__ ? SEED_ACCOUNTS.map(a => ({ ...a, user: { ...a.user } })) : []);
      let changed = !raw;
      const migrated: AuthAccount[] = [];
      for (const account of stored) {
        if (account.password !== undefined) {
          const credentials = await hashPassword(account.password);
          const { password: _legacyPassword, ...safe } = account;
          migrated.push({ ...safe, ...credentials }); changed = true;
        } else migrated.push(account);
      }
      if (changed) await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(migrated));
      return migrated;
    })();
    try { return await accountsLoading; } finally { accountsLoading = null; }
  },

  async saveAccount(account: AuthAccount): Promise<void> {
    try {
      const accounts = await this.loadAccounts();
      const existingIdx = accounts.findIndex(
        (a) => a.email.toLowerCase() === account.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        accounts[existingIdx] = account;
      } else {
        accounts.push(account);
      }
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      throw e;
    }
  },

  // Workspace Data
  async loadWorkspaceData(workspaceId: string): Promise<WorkspaceData> {
    try {
      const key = `${WORKSPACE_DATA_PREFIX}${workspaceId}`;
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          comments: parsed.comments || [],
          reminders: parsed.reminders || [],
        };
      }

      // If it's the seed company workspace and hasn't been saved yet, initialize with demo records
      if (workspaceId === 'ws_isaacify') {
        const initialData: WorkspaceData = {
          clients: INITIAL_CLIENTS.map((c) => ({ ...c, workspaceId })),
          projects: INITIAL_PROJECTS.map((p) => ({ ...p, workspaceId })),
          tasks: INITIAL_TASKS.map((t) => ({ ...t, workspaceId })),
          invoices: INITIAL_INVOICES.map((i) => ({ ...i, workspaceId })),
          transactions: INITIAL_TRANSACTIONS.map((t) => ({ ...t, workspaceId })),
          deliverables: [
            {
              ...INITIAL_DELIVERABLE,
              workspaceId,
              version: 'v2',
              history: [
                {
                  version: 'v1',
                  fileName: 'Homepage-v1-initial.fig',
                  status: 'changes_requested',
                  submittedAt: 'Yesterday at 3:15 PM',
                  clientFeedback: 'Please revise spice hero banner and CTA buttons.',
                },
              ],
            },
          ],
          messages: [
            {
              id: 'msg_1',
              workspaceId,
              clientId: 'usr_senuri',
              projectId: 'prj_ceylonbites',
              senderId: 'usr_isaacify_company',
              senderName: 'Kasun (ISAACIFY)',
              senderRole: 'team',
              text: 'Hi Senuri, we have uploaded the revised Homepage v2 design. Please take a look!',
              timestamp: 'Today at 11:20 AM',
              read: true,
            },
            {
              id: 'msg_2',
              workspaceId,
              clientId: 'cl_senuri',
              projectId: 'prj_ceylonbites',
              senderId: 'usr_senuri_client',
              senderName: 'Senuri Perera',
              senderRole: 'client',
              text: 'Thanks Kasun! Checking now. Love the spice palette update.',
              timestamp: 'Today at 11:45 AM',
              read: true,
            },
          ],
          meetings: [{ ...INITIAL_MEETING, workspaceId }],
          notifications: INITIAL_NOTIFICATIONS.map((n) => ({ ...n, workspaceId })),
          teamMembers: [
            {
              id: 'tm_1',
              workspaceId,
              name: 'Kasun Perera',
              email: 'kasun@design.io',
              role: 'owner',
              status: 'active',
              assignedProjectIds: ['prj_ceylonbites'],
            },
            {
              id: 'tm_2',
              workspaceId,
              name: 'Abhilash V',
              email: 'isaacify.info@gmail.com',
              role: 'admin',
              status: 'active',
              assignedProjectIds: ['prj_ceylonbites', 'prj_harbor'],
            },
          ],
          comments: [
            {
              id: 'cmt_1',
              workspaceId,
              targetType: 'project',
              targetId: 'prj_ceylonbites',
              authorId: 'usr_isaacify_company',
              authorName: 'Kasun Perera',
              authorRole: 'team',
              text: 'Kickoff completed. Design tokens and brand typography initialized.',
              createdAt: '2026-09-16T10:00:00.000Z',
              visibility: 'shared',
            },
          ],
          reminders: [
            {
              id: 'rem_1',
              workspaceId,
              title: 'Review CeylonBites Homepage v2',
              dateTime: '2026-10-10T14:00:00.000Z',
              status: 'pending',
              linkedType: 'project',
              linkedId: 'prj_ceylonbites',
              linkedTitle: 'CeylonBites Brand & Website',
              notify: true,
              type: 'project',
              createdAt: '2026-09-16T10:00:00.000Z',
            },
          ],
        };
        await AsyncStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }

      // FOR ANY NEW WORKSPACE: Genuinely empty state!
      const empty = createEmptyWorkspaceData();
      await AsyncStorage.setItem(key, JSON.stringify(empty));
      return empty;
    } catch (error) {
      throw error;
    }
  },

  async saveWorkspaceData(workspaceId: string, data: WorkspaceData): Promise<void> {
    const key = `${WORKSPACE_DATA_PREFIX}${workspaceId}`;
    const serialized = JSON.stringify(data);
    const previous = writes.get(key) || Promise.resolve();
    const pending = previous.catch(() => {}).then(() => AsyncStorage.setItem(key, serialized));
    writes.set(key, pending);
    try { await pending; } finally { if (writes.get(key) === pending) writes.delete(key); }
  },
};
