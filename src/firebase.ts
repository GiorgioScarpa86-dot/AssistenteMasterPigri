import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ============================================================================
// 🔥 FIREBASE CONFIGURATION - PASTE YOUR KEYS HERE
// ============================================================================
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (free Spark plan)
// 3. Go to Project Settings > General > Your apps > Web app
// 4. Copy the firebaseConfig object and paste below
// 5. Enable Anonymous Auth: Authentication > Sign-in method > Anonymous > Enable
// 6. Enable Firestore: Firestore Database > Create database > Start in test mode
//
// If you leave these as placeholder, the app will work in OFFLINE MODE
// using localStorage automatically. No crash.
// ============================================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

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
