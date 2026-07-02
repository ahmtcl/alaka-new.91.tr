/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminStorage: any = null;

export function getAdminStorage() {
  if (_adminStorage) return _adminStorage;

  const { initializeApp, getApps, cert } = require("firebase-admin/app");
  const { getStorage } = require("firebase-admin/storage");

  if (!getApps().length) {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  _adminStorage = getStorage();
  return _adminStorage;
}
