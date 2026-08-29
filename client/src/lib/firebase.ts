import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCs49wuyK7hCpU9NAAEWxp2qJTA6tOOJhQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'decision-vaultx.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'decision-vaultx',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'decision-vaultx.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '385523564979',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:385523564979:web:e8b4ecce52f34d46b18bc6',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MPGZQVYW23',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
