
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider as FirebaseGoogleAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Extend FirebaseUser with custom fields if needed
export interface User extends FirebaseUser {
  bio?: string;
  // Add other custom fields here if you store them on the user object itself
  // or prefer to merge them from a separate Firestore document.
}

let app: FirebaseApp;
let authInstance: ReturnType<typeof getAuth>;
let dbInstance: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

authInstance = getAuth(app);
dbInstance = getFirestore(app);

export const auth = authInstance;
export const db = dbInstance;
export const GoogleAuthProvider = FirebaseGoogleAuthProvider; // Exporting the class itself

// Helper to simulate a delay (can be removed in production)
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
