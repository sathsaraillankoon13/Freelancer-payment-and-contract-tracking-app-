import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4AzBZpHDFosURCzPSNN6VLbNk_o5c-4g",
  authDomain: "freelancer-app-d9103.firebaseapp.com",
  projectId: "freelancer-app-d9103",
  storageBucket: "freelancer-app-d9103.firebasestorage.app",
  messagingSenderId: "355877444845",
  appId: "1:355877444845:web:4a21239e09d62a450b40e4",
  measurementId: "G-D11MS92PP5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_CLIENTS = [
  {
    id: 'cl_senuri',
    workspaceId: 'ws_isaacify',
    name: 'Senuri Perera',
    companyName: 'CeylonBites Spices',
    email: 'senuri@ceylonbites.lk',
    phone: '+94 77 123 4567',
    status: 'active',
    isArchived: false,
    linkedUserId: 'usr_senuri_client',
    outstandingBalance: 108000,
    internalNotes: 'Key client for Q4 spice brand launch and direct export e-commerce.',
  },
  {
    id: 'cl_harbor',
    workspaceId: 'ws_isaacify',
    name: 'David Lee',
    companyName: 'Harbor Studio',
    email: 'david@harborstudio.com',
    phone: '+94 71 987 6543',
    status: 'active',
    isArchived: false,
    outstandingBalance: 140000,
    internalNotes: 'Architectural portfolio website and 3D showroom render integration.',
  },
  {
    id: 'cl_bloom',
    workspaceId: 'ws_isaacify',
    name: 'Amara Fernando',
    companyName: 'Bloom Creative',
    email: 'amara@bloomcreative.lk',
    phone: '+94 76 555 4321',
    status: 'active',
    isArchived: false,
    outstandingBalance: 0,
    internalNotes: 'Sustainable fashion retail catalog and marketing collaterals.',
  },
];

const INITIAL_PROJECTS = [
  {
    id: 'prj_ceylonbites',
    workspaceId: 'ws_isaacify',
    title: 'CeylonBites Brand & Website',
    clientId: 'cl_senuri',
    clientName: 'Senuri Perera',
    clientInitials: 'CB',
    status: 'In Progress',
    progressPercentage: 60,
    totalTasks: 10,
    completedTasks: 6,
    currentMilestone: 'Milestone 2 of 4',
    milestoneRatio: '2/4',
    dueDate: '30 Sep 2026',
    startDate: '01 Sep 2026',
    budget: 180000,
    currency: 'LKR',
    priority: 'High',
    daysLeftText: '3 days left',
    currentFocus: 'Homepage & spice catalogue layout finalisation',
    scopeNotes: 'Complete visual identity, packaging labels, and Shopify custom theme.',
    revisionLimit: 3,
    usedRevisions: 1,
    assignedTeam: ['usr_kasun', 'usr_isaacify_company'],
    milestones: [
      {
        id: 'ms_1',
        title: 'Brand Discovery & Moodboards',
        description: 'Colour palettes, typography hierarchy, and brand direction',
        dueDate: '08 Sep 2026',
        status: 'approved',
        order: 1,
        amount: 45000,
      },
      {
        id: 'ms_2',
        title: 'Homepage & E-Commerce Wireframes',
        description: 'Desktop and mobile wireframes with product grid',
        dueDate: '16 Sep 2026',
        status: 'pending',
        order: 2,
        amount: 55000,
      },
      {
        id: 'ms_3',
        title: 'Frontend Development & Theme Integration',
        description: 'Responsive Shopify Liquid template development',
        dueDate: '24 Sep 2026',
        status: 'pending',
        order: 3,
        amount: 50000,
      },
      {
        id: 'ms_4',
        title: 'QA Testing & Handover',
        description: 'Cross-browser testing, payment gateway testing, and asset delivery',
        dueDate: '30 Sep 2026',
        status: 'pending',
        order: 4,
        amount: 30000,
      },
    ],
    terms: [
      {
        id: 'trm_1',
        title: 'Revision Limits',
        clause: 'Each milestone includes up to 2 revision rounds. Additional iterations will be billed at standard hourly rates.',
        category: 'Scope & Revisions',
        isStandard: true,
      },
      {
        id: 'trm_2',
        title: 'Payment Schedule',
        clause: 'Invoices are issued upon milestone completion with 7-day payment terms.',
        category: 'Billing & Invoicing',
        isStandard: true,
      },
    ],
    scopeChanges: [
      {
        id: 'sc_1',
        requestedBy: 'Senuri Perera',
        description: 'Add wholesale portal B2B inquiry form to CeylonBites site',
        additionalBudget: 25000,
        additionalDays: 4,
        status: 'accepted',
        createdAt: '2026-09-12T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'prj_harbor',
    workspaceId: 'ws_isaacify',
    title: 'Harbor Studio Identity',
    clientId: 'cl_harbor',
    clientName: 'David Lee',
    clientInitials: 'HS',
    status: 'In Progress',
    progressPercentage: 40,
    totalTasks: 8,
    completedTasks: 3,
    currentMilestone: 'Milestone 2 of 3',
    milestoneRatio: '1/3',
    dueDate: '15 Oct 2026',
    startDate: '10 Sep 2026',
    budget: 140000,
    currency: 'LKR',
    priority: 'Medium',
    daysLeftText: '18 days left',
    currentFocus: 'Brand guidelines book and 3D architectural asset guidelines',
    scopeNotes: 'Minimalist brand identity for luxury architectural design studio.',
    revisionLimit: 3,
    usedRevisions: 0,
    assignedTeam: ['usr_kasun'],
    milestones: [
      {
        id: 'ms_h1',
        title: 'Visual Identity System',
        description: 'Logo, wordmark, color scheme, and typography',
        dueDate: '25 Sep 2026',
        status: 'approved',
        order: 1,
        amount: 60000,
      },
      {
        id: 'ms_h2',
        title: 'Marketing Collateral Suite',
        description: 'Brochure templates, business cards, and social headers',
        dueDate: '08 Oct 2026',
        status: 'pending',
        order: 2,
        amount: 50000,
      },
      {
        id: 'ms_h3',
        title: 'Brand Style Guide & Assets',
        description: 'Comprehensive guidelines and production file package',
        dueDate: '15 Oct 2026',
        status: 'pending',
        order: 3,
        amount: 30000,
      },
    ],
    terms: [],
    scopeChanges: [],
  },
  {
    id: 'prj_bloom',
    workspaceId: 'ws_isaacify',
    title: 'Bloom Creative Packaging',
    clientId: 'cl_bloom',
    clientName: 'Amara Fernando',
    clientInitials: 'BC',
    status: 'Completed',
    progressPercentage: 100,
    totalTasks: 6,
    completedTasks: 6,
    currentMilestone: 'Completed',
    milestoneRatio: '3/3',
    dueDate: '20 Sep 2026',
    startDate: '20 Aug 2026',
    budget: 95000,
    currency: 'LKR',
    priority: 'Low',
    daysLeftText: 'Completed',
    currentFocus: 'Project archived and assets delivered to print production',
    scopeNotes: 'Eco-friendly luxury apparel packaging box and tag design suite.',
    revisionLimit: 2,
    usedRevisions: 2,
    assignedTeam: ['usr_kasun'],
    milestones: [],
    terms: [],
    scopeChanges: [],
  },
];

const INITIAL_INVOICES = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2026-001',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    clientId: 'cl_senuri',
    clientName: 'Senuri Perera',
    totalAmount: 72000,
    paidAmount: 72000,
    outstandingAmount: 0,
    currency: 'LKR',
    issueDate: '01 Sep 2026',
    dueDate: '15 Sep 2026',
    status: 'Paid',
    notes: 'Initial 40% project kickoff retainer deposit.',
    items: [
      {
        id: 'itm_1',
        description: 'Project Initiation & Brand Discovery Retainer (40%)',
        quantity: 1,
        rate: 72000,
        amount: 72000,
      },
    ],
    payments: [
      {
        id: 'pay_1',
        amount: 72000,
        submittedAt: '2026-09-03',
        status: 'verified',
        referenceNumber: 'BOC-TXN-884910',
        verifiedAt: '2026-09-04T09:30:00.000Z',
        paymentMethod: 'Bank Transfer (BOC)',
      },
    ],
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2026-002',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    clientId: 'cl_senuri',
    clientName: 'Senuri Perera',
    totalAmount: 54000,
    paidAmount: 0,
    outstandingAmount: 54000,
    currency: 'LKR',
    issueDate: '16 Sep 2026',
    dueDate: '30 Sep 2026',
    status: 'Sent',
    notes: 'Milestone 2 milestone progress payment.',
    items: [
      {
        id: 'itm_2',
        description: 'Milestone 2: Homepage & UI Wireframes Approved',
        quantity: 1,
        rate: 54000,
        amount: 54000,
      },
    ],
    payments: [],
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2026-003',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    clientId: 'cl_senuri',
    clientName: 'Senuri Perera',
    totalAmount: 54000,
    paidAmount: 0,
    outstandingAmount: 54000,
    currency: 'LKR',
    issueDate: '24 Sep 2026',
    dueDate: '08 Oct 2026',
    status: 'Draft',
    notes: 'Milestone 3 & Final project deployment balance.',
    items: [
      {
        id: 'itm_3',
        description: 'Milestone 3 & Final Handover Retainer (30%)',
        quantity: 1,
        rate: 54000,
        amount: 54000,
      },
    ],
    payments: [],
  },
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_1',
    clientId: 'cl_senuri',
    projectId: 'prj_ceylonbites',
    senderId: 'usr_kasun',
    senderName: 'Kasun Perera',
    senderRole: 'freelancer',
    text: 'Hi Senuri, I have uploaded Homepage Design v2 with the spice hero update. Please review when convenient!',
    timestamp: 'Today at 10:18 AM',
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_2',
    clientId: 'cl_senuri',
    projectId: 'prj_ceylonbites',
    senderId: 'usr_senuri_client',
    senderName: 'Senuri Perera',
    senderRole: 'client',
    text: 'Thanks Kasun! The palette looks fantastic. Reviewing the mobile navigation flow now.',
    timestamp: 'Today at 11:05 AM',
    read: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_DELIVERABLE = {
  id: 'del_1',
  projectId: 'prj_ceylonbites',
  projectTitle: 'CeylonBites Brand & Website',
  deliverableName: 'Homepage Design v2 — High Fidelity Figma Spec',
  fileName: 'ceylonbites-homepage-v2.pdf',
  fileSize: '4.8 MB',
  fileType: 'PDF Document',
  version: 'v2',
  author: 'Kasun Perera',
  authorNote: 'Updated hero section with spice plantation photography and responsive navigation menu.',
  submittedText: 'Submitted today',
  submittedAt: 'Today at 10:15 AM',
  status: 'action_required',
  history: [
    {
      version: 'v1',
      fileName: 'ceylonbites-homepage-v1.pdf',
      status: 'changes_requested',
      submittedAt: '12 Sep 2026',
      clientFeedback: 'Need brighter spice color accents in the header banner.',
    },
  ],
};

const INITIAL_TASKS = [
  {
    id: 'tsk_1',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    title: 'Review spice packaging mockup with Senuri',
    scheduledTime: 'Today · 10:00 AM',
    dueDate: '2026-09-28',
    completed: false,
    order: 1,
    priority: 'High',
    assignee: 'Kasun Perera',
    estimatedHours: 2,
    status: 'in_progress',
  },
  {
    id: 'tsk_2',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    title: 'Upload high-resolution logo assets & font licences',
    scheduledTime: 'Today · 02:30 PM',
    dueDate: '2026-09-28',
    completed: false,
    order: 2,
    priority: 'Medium',
    assignee: 'Kasun Perera',
    estimatedHours: 1,
    status: 'pending',
  },
  {
    id: 'tsk_3',
    projectId: 'prj_ceylonbites',
    projectTitle: 'CeylonBites Brand & Website',
    title: 'Generate Milestone 2 invoice & dispatch to client',
    scheduledTime: 'Tomorrow · 09:00 AM',
    dueDate: '2026-09-29',
    completed: true,
    order: 3,
    priority: 'Medium',
    assignee: 'Abhilash V',
    estimatedHours: 1,
    status: 'completed',
  },
];

async function seedData() {
  console.log("Seeding all initial datasets to Cloud Firestore...");

  for (const c of INITIAL_CLIENTS) {
    await setDoc(doc(db, 'clients', c.id), c, { merge: true });
    console.log(`Saved client: ${c.name}`);
  }

  for (const p of INITIAL_PROJECTS) {
    await setDoc(doc(db, 'projects', p.id), p, { merge: true });
    console.log(`Saved project: ${p.title}`);
  }

  for (const inv of INITIAL_INVOICES) {
    await setDoc(doc(db, 'invoices', inv.id), inv, { merge: true });
    console.log(`Saved invoice: ${inv.invoiceNumber}`);
  }

  for (const msg of INITIAL_MESSAGES) {
    await setDoc(doc(db, 'messages', msg.id), msg, { merge: true });
    console.log(`Saved message: ${msg.id}`);
  }

  await setDoc(doc(db, 'deliverables', INITIAL_DELIVERABLE.id), INITIAL_DELIVERABLE, { merge: true });
  console.log(`Saved deliverable: ${INITIAL_DELIVERABLE.deliverableName}`);

  for (const t of INITIAL_TASKS) {
    await setDoc(doc(db, 'tasks', t.id), t, { merge: true });
    console.log(`Saved task: ${t.title}`);
  }

  console.log("\n>>> SUCCESS: All initial data seeded into Firestore freelancer-app-d9103! <<<");
  process.exit(0);
}

seedData();
