import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ============================================================================
// 🔥 FIREBASE CONFIGURATION
// ============================================================================
// The app reads your Firebase web-app config from environment variables so
// that keys do NOT have to be committed to the repository.
//
// WHERE TO GET THE VALUES
//   1. https://console.firebase.google.com/ → create a project (free Spark plan)
//   2. Project Settings → General → Your apps → Web app → copy the config
//   3. Enable Anonymous Auth: Authentication → Sign-in method → Anonymous
//   4. Enable Firestore: Firestore Database → Create database → test mode
//
// HOW TO PROVIDE THEM (pick one)
//   A) RECOMMENDED — create a file named `.env.local` in the project root
//      (already git-ignored), copy `.env.example`, paste the six values,
//      then (re)start `npm run dev` / `npm run build`.
//   B) ZERO-CONFIG — paste the values in INLINE_FALLBACK below. Be aware they
//      will then travel with the repo. Firebase web keys are public
//      identifiers by design, but protect your data with Firestore rules.
//
// If nothing is provided the app runs in OFFLINE MODE using localStorage.
// No crash. See README.md → "Step 4".
// ============================================================================

const INLINE_FALLBACK = {
  apiKey: "AIzaSyDWXQuvwvn8M9t9EIodjXF_Y4o1yrXibZk",
  authDomain: "assistentemasterpigri.firebaseapp.com",
  projectId: "assistentemasterpigri",
  storageBucket: "assistentemasterpigri.firebasestorage.app",
  messagingSenderId: "528695691734",
  appId: "1:528695691734:web:9d0304ae27bc43e2defc77"
};

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || INLINE_FALLBACK.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || INLINE_FALLBACK.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || INLINE_FALLBACK.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || INLINE_FALLBACK.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || INLINE_FALLBACK.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || INLINE_FALLBACK.appId
};

const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: any = null;
let auth: any = null;
let db: any = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase initialized");
  } catch (e) {
    console.warn("⚠️ Firebase init failed, falling back to offline mode", e);
  }
} else {
  console.log("ℹ️ Firebase not configured - running in offline localStorage mode. See src/firebase.ts for setup.");
}

export { app, auth, db, isConfigured };

export const ensureAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsub();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          unsub();
          resolve(cred.user);
        } catch (e) {
          console.warn("Anonymous auth failed", e);
          unsub();
          resolve(null);
        }
      }
    });
  });
};
