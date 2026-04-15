import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getApp() {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getAuthInstance(): Auth {
  if (!_auth) {
    const a = getApp();
    if (!a) throw new Error("Firebase is not configured");
    _auth = getAuth(a);
  }
  return _auth;
}

export function getDbInstance(): Firestore {
  if (!_db) {
    const a = getApp();
    if (!a) throw new Error("Firebase is not configured");
    _db = getFirestore(a);
  }
  return _db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!_storage) {
    const a = getApp();
    if (!a) throw new Error("Firebase is not configured");
    _storage = getStorage(a);
  }
  return _storage;
}
