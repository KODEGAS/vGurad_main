import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBnTszVHUE71BBq0Wg9KN328KxnoJmhcmk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vguard-d7ca7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vguard-d7ca7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vguard-d7ca7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "541688771224",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:541688771224:web:b3b62f680a78e5f64556ed",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NLK45153SF"
};

console.log('Firebase config being used:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
