import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration provided from Firebase Console
export const firebaseConfig = {
  apiKey: "AIzaSyA4AzBZpHDFosURCzPSNN6VLbNk_o5c-4g",
  authDomain: "freelancer-app-d9103.firebaseapp.com",
  projectId: "freelancer-app-d9103",
  storageBucket: "freelancer-app-d9103.firebasestorage.app",
  messagingSenderId: "355877444845",
  appId: "1:355877444845:web:4a21239e09d62a450b40e4",
  measurementId: "G-D11MS92PP5",
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore with long polling enabled for React Native / mobile stability
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

// Initialize Firebase Auth
export const auth = getAuth(app);


