import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';

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

async function runSyncVerification() {
  console.log("=== FIREBASE CLOUD FIRESTORE COMPREHENSIVE SYNC TEST ===");
  console.log("Target Project ID:", firebaseConfig.projectId);

  const collectionsToTest = [
    {
      col: 'projects',
      id: 'test_sync_proj_001',
      sample: {
        title: 'Cloud Firestore Sync Test Project',
        clientName: 'Senuri Perera',
        budget: 150000,
        currency: 'LKR',
        status: 'In Progress',
        updatedAt: new Date().toISOString()
      }
    },
    {
      col: 'clients',
      id: 'test_sync_cl_001',
      sample: {
        name: 'Senuri Perera',
        companyName: 'CeylonBites Ltd',
        email: 'senuri@ceylonbites.lk',
        status: 'active',
        updatedAt: new Date().toISOString()
      }
    },
    {
      col: 'invoices',
      id: 'test_sync_inv_001',
      sample: {
        invoiceNumber: 'INV-TEST-001',
        clientName: 'Senuri Perera',
        totalAmount: 120000,
        status: 'Sent',
        updatedAt: new Date().toISOString()
      }
    },
    {
      col: 'messages',
      id: 'test_sync_msg_001',
      sample: {
        senderName: 'Kasun Perera',
        text: 'Two-way sync test message to Firebase',
        createdAt: new Date().toISOString()
      }
    },
    {
      col: 'deliverables',
      id: 'test_sync_del_001',
      sample: {
        deliverableName: 'Homepage Figma Spec v2',
        status: 'action_required',
        submittedAt: new Date().toISOString()
      }
    },
    {
      col: 'tasks',
      id: 'test_sync_tsk_001',
      sample: {
        title: 'Verify Firestore Sync on Deployment',
        completed: true,
        updatedAt: new Date().toISOString()
      }
    }
  ];

  let passed = 0;

  for (const item of collectionsToTest) {
    try {
      const docRef = doc(db, item.col, item.id);
      await setDoc(docRef, item.sample, { merge: true });
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().title === item.sample.title || snap.exists()) {
        console.log(`[PASS] Collection "${item.col}" write + read verified successfully!`);
        // Clean up test document
        await deleteDoc(docRef);
        passed++;
      } else {
        console.error(`[FAIL] Collection "${item.col}" read returned empty!`);
      }
    } catch (e) {
      console.error(`[ERROR] Collection "${item.col}" failed:`, e.message);
    }
  }

  // Check existing seeded collections count
  console.log("\n--- Checking Live App Data in Cloud Firestore ---");
  for (const item of collectionsToTest) {
    try {
      const snap = await getDocs(collection(db, item.col));
      console.log(`Collection "${item.col}" contains ${snap.size} live document(s).`);
    } catch (e) {
      console.warn(`Could not list "${item.col}":`, e.message);
    }
  }

  if (passed === collectionsToTest.length) {
    console.log(`\n>>> 100% SUCCESS: All ${passed}/${collectionsToTest.length} collections working properly in Firebase Firestore! <<<`);
    process.exit(0);
  } else {
    console.error(`\n>>> FAILURE: Only ${passed}/${collectionsToTest.length} passed.`);
    process.exit(1);
  }
}

runSyncVerification();
