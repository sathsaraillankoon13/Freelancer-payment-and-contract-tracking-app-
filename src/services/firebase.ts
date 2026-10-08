import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

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

// Initialize Cloud Firestore with auto-detect long polling for stability
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

import { Platform } from 'react-native';
import * as FirebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase Auth with persistence
let firebaseAuth;
try {
  if (Platform.OS === 'web') {
    firebaseAuth = FirebaseAuth.getAuth(app);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getRNPersistence = (FirebaseAuth as any).getReactNativePersistence;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initAuth = (FirebaseAuth as any).initializeAuth || FirebaseAuth.getAuth;
    if (typeof getRNPersistence === 'function') {
      firebaseAuth = initAuth(app, {
        persistence: getRNPersistence(AsyncStorage),
      });
    } else {
      firebaseAuth = FirebaseAuth.getAuth(app);
    }
  }
} catch {
  firebaseAuth = FirebaseAuth.getAuth(app);
}
export const auth = firebaseAuth;


