import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize a secondary app instance specifically for creating users 
// so it doesn't log out the active admin user on the primary app.
const SECONDARY_APP_NAME = "SecondaryApp";

const secondaryApp = getApps().find(app => app.name === SECONDARY_APP_NAME) 
  || initializeApp(firebaseConfig, SECONDARY_APP_NAME);

const secondaryAuth = getAuth(secondaryApp);

export { secondaryApp, secondaryAuth };
