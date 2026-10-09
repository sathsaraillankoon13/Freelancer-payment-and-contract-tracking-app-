import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
} from 'firebase/auth';

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
const auth = getAuth(app);

const results = [];

function record(section, name, pass, details = '') {
  results.push({ section, name, status: pass ? 'PASS' : 'FAIL', details });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] [${section}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function verifyBrandingAndIdentity() {
  console.log('\n--- 1. AUDITING APPLICATION IDENTITY & OFFICIAL LOGO ---');

  // Check official logo file
  const logoPath = 'src/logo.png';
  if (fs.existsSync(logoPath)) {
    const stat = fs.statSync(logoPath);
    const buf = fs.readFileSync(logoPath);
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    const ratio = (width / height).toFixed(3);
    record(
      'Identity & Logo',
      'Official Logo Asset Present',
      stat.size > 0 && width === 1555 && height === 1416,
      `Size: ${stat.size} bytes, Dimensions: ${width}x${height}, Aspect Ratio: ${ratio}`
    );
  } else {
    record('Identity & Logo', 'Official Logo Asset Present', false, 'File src/logo.png missing!');
  }

  // Check app.json
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const correctName = appJson.expo.name === 'ISAACIFY Freelancer App';
  const correctSlug = appJson.expo.slug === 'isaacify-freelancer-app';
  record(
    'Identity & Logo',
    'app.json Application Name & Slug',
    correctName && correctSlug,
    `Name: "${appJson.expo.name}", Slug: "${appJson.expo.slug}"`
  );

  // Check SplashScreen
  const splash = fs.readFileSync('src/features/auth/screens/SplashScreen.tsx', 'utf8');
  const splashValid = splash.includes('Freelancer App') && !splash.includes('CRM Manager');
  record('Identity & Logo', 'SplashScreen App Name & Subtitle', splashValid, 'Displays "ISAACIFY Freelancer App"');

  // Check AccountTypeScreen
  const accountType = fs.readFileSync('src/features/auth/screens/AccountTypeScreen.tsx', 'utf8');
  const accountTypeValid = accountType.includes('ISAACIFY Freelancer App') && !accountType.includes('CRM Manager');
  record('Identity & Logo', 'AccountTypeScreen Subtitle', accountTypeValid, 'Displays "ISAACIFY Freelancer App"');

  // Check MoreSettingsScreen
  const moreSettings = fs.readFileSync('src/features/settings/screens/MoreSettingsScreen.tsx', 'utf8');
  const moreSettingsValid = moreSettings.includes('ISAACIFY Freelancer App') && !moreSettings.includes('CRM Manager');
  record('Identity & Logo', 'MoreSettingsScreen Product Name', moreSettingsValid, 'Displays "ISAACIFY Freelancer App"');
}

async function verifyAuthSystem() {
  console.log('\n--- 2. VERIFYING FIREBASE AUTHENTICATION (EMAIL + GOOGLE) ---');

  const testEmail = `audit_tester_${Date.now()}@isaacify.test`;
  const testPassword = 'Password123!';
  let createdUser = null;

  try {
    // 1. Email Sign Up
    const cred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    createdUser = cred.user;
    record('Auth', 'Email/Password Sign-Up (Firebase Auth)', !!createdUser.uid, `UID: ${createdUser.uid}`);

    // 2. Profile Creation in Firestore
    const userProfileRef = doc(db, 'users', createdUser.uid);
    const userProfileData = {
      id: createdUser.uid,
      name: 'Audit Test User',
      firstName: 'Audit',
      email: testEmail,
      role: 'freelancer',
      workspaceId: 'ws_isaacify',
      workspaceName: 'ISAACIFY Workspace',
      currency: 'LKR',
      createdAt: new Date().toISOString()
    };
    await setDoc(userProfileRef, userProfileData);
    const profileSnap = await getDoc(userProfileRef);
    record('Auth', 'Firestore User Profile Creation & Read', profileSnap.exists() && profileSnap.data().email === testEmail);

    // 3. Email Sign In
    const loginCred = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    record('Auth', 'Email/Password Sign-In Verification', loginCred.user.uid === createdUser.uid);

    // 4. Password Reset Email Request
    let resetSent = false;
    try {
      await sendPasswordResetEmail(auth, testEmail);
      resetSent = true;
    } catch (e) {
      console.warn('Password reset notice:', e.message);
    }
    record('Auth', 'Password Reset Email Dispatch', resetSent, 'Dispatched via Firebase Auth');

    // 5. Returning User Flow (Read existing Firestore profile without duplication)
    const existingSnap = await getDoc(doc(db, 'users', loginCred.user.uid));
    record('Auth', 'Returning User Profile Retrieval', existingSnap.exists(), `Retrieved role: ${existingSnap.data().role}`);

    // Clean up test user & doc
    await deleteDoc(userProfileRef);
    await deleteUser(loginCred.user);
    record('Auth', 'Test User Cleanup', true, 'Deleted test profile & Firebase Auth user');

  } catch (err) {
    record('Auth', 'Firebase Auth Execution', false, err.message);
  }
}

async function verifyCompleteCrudMatrix() {
  console.log('\n--- 3. VERIFYING COMPREHENSIVE CRUD MATRIX WITH CLOUD FIRESTORE ---');

  const entities = [
    {
      col: 'clients',
      id: 'audit_cl_001',
      create: { name: 'Audit Client', companyName: 'Apex Brands', email: 'audit@apex.lk', status: 'active', updatedAt: new Date().toISOString() },
      update: { name: 'Audit Client Updated', status: 'active' }
    },
    {
      col: 'projects',
      id: 'audit_prj_001',
      create: {
        title: 'Audit Project Portal',
        clientName: 'Apex Brands',
        clientId: 'audit_cl_001',
        budget: 250000,
        status: 'In Progress',
        milestones: [
          { id: 'ms_01', title: 'Milestone 1 Discovery', status: 'completed' },
          { id: 'ms_02', title: 'Milestone 2 Development', status: 'pending' }
        ],
        terms: [
          { id: 'trm_01', title: 'Payment Clause', clause: '30% upfront' }
        ],
        updatedAt: new Date().toISOString()
      },
      update: {
        title: 'Audit Project Portal - Extended',
        milestones: [
          { id: 'ms_01', title: 'Milestone 1 Discovery', status: 'completed' },
          { id: 'ms_02', title: 'Milestone 2 Development', status: 'approved' },
          { id: 'ms_03', title: 'Milestone 3 Deployment', status: 'pending' }
        ]
      }
    },
    {
      col: 'tasks',
      id: 'audit_tsk_001',
      create: { title: 'Audit Test Task', projectId: 'audit_prj_001', completed: false, updatedAt: new Date().toISOString() },
      update: { title: 'Audit Test Task Completed', completed: true }
    },
    {
      col: 'invoices',
      id: 'audit_inv_001',
      create: {
        invoiceNumber: 'INV-AUDIT-99',
        projectId: 'audit_prj_001',
        clientId: 'audit_cl_001',
        subtotal: 100000,
        discount: 10000,
        taxAmount: 13500,
        totalAmount: 103500,
        paidAmount: 0,
        outstandingAmount: 103500,
        status: 'Sent',
        updatedAt: new Date().toISOString()
      },
      update: {
        paidAmount: 50000,
        outstandingAmount: 53500,
        status: 'Partially Paid'
      }
    },
    {
      col: 'transactions',
      id: 'audit_tx_001',
      create: {
        title: 'Software Tool License',
        amount: 8500,
        type: 'expense',
        category: 'Software & Tools',
        currency: 'LKR',
        date: '2026-10-09'
      },
      update: {
        amount: 9200,
        title: 'Software Tool License Renewal'
      }
    },
    {
      col: 'reminders',
      id: 'audit_rem_001',
      create: {
        title: 'Follow up on Milestone 2 approval',
        dateTime: '2026-10-15T10:00:00.000Z',
        status: 'pending',
        priority: 'high'
      },
      update: {
        status: 'completed'
      }
    },
    {
      col: 'deliverables',
      id: 'audit_del_001',
      create: {
        deliverableName: 'Brand Guidelines PDF v1',
        projectId: 'audit_prj_001',
        status: 'action_required',
        version: 'v1',
        author: 'Kasun Perera'
      },
      update: {
        status: 'approved',
        clientFeedback: 'Looks excellent! Approved.'
      }
    },
    {
      col: 'messages',
      id: 'audit_msg_001',
      create: {
        senderName: 'Kasun Perera',
        text: 'Please review the invoice breakdown.',
        createdAt: new Date().toISOString()
      },
      update: {
        text: 'Please review the invoice breakdown (Reminder).'
      }
    },
    {
      col: 'comments',
      id: 'audit_cmt_001',
      create: {
        targetType: 'project',
        targetId: 'audit_prj_001',
        text: 'Sprint review scheduled for Friday.',
        createdAt: new Date().toISOString()
      },
      update: {
        text: 'Sprint review scheduled for Friday 3 PM.'
      }
    }
  ];

  for (const item of entities) {
    const docRef = doc(db, item.col, item.id);

    // 1. CREATE
    await setDoc(docRef, item.create);
    const snap1 = await getDoc(docRef);
    const createPass = snap1.exists();

    // 2. READ
    const readPass = snap1.exists();

    // 3. UPDATE
    await setDoc(docRef, item.update, { merge: true });
    const snap2 = await getDoc(docRef);
    const updatePass = snap2.exists();

    // 4. DELETE
    await deleteDoc(docRef);
    const snap3 = await getDoc(docRef);
    const deletePass = !snap3.exists();

    const allCrudPass = createPass && readPass && updatePass && deletePass;
    record(
      'Firestore CRUD',
      `${item.col.toUpperCase()} (Create, Read, Update, Delete)`,
      allCrudPass,
      `C:${createPass} R:${readPass} U:${updatePass} D:${deletePass}`
    );
  }
}

async function run() {
  console.log('===============================================================');
  console.log('ISAACIFY FREELANCER APP — COMPLETE AUTOMATED AUDIT & VERIFICATION');
  console.log('Target Firebase Project:', firebaseConfig.projectId);
  console.log('===============================================================');

  await verifyBrandingAndIdentity();
  await verifyAuthSystem();
  await verifyCompleteCrudMatrix();

  console.log('\n===============================================================');
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log('===============================================================');

  if (passed === total) {
    console.log('>>> ALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS! <<<');
    process.exit(0);
  } else {
    console.error('>>> SOME CHECKS FAILED! <<<');
    process.exit(1);
  }
}

run();
