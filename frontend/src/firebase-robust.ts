import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBnTszVHUE71BBq0Wg9KN328KxnoJmhcmk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vguard-d7ca7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vguard-d7ca7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vguard-d7ca7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "541688771224",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:541688771224:web:b3b62f680a78e5f64556ed",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NLK45153SF"
};

console.log('🔥 Firebase config being used:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  environment: import.meta.env.MODE
});

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Set persistence to local
  setPersistence(auth, browserLocalPersistence).catch(err => {
    console.warn('Could not set auth persistence:', err);
  });
  
  // For development in codespace, you might want to use emulator
  // Uncomment the line below if you want to use Firebase emulator
  // if (location.hostname === 'localhost' || location.hostname.includes('github.dev')) {
  //   connectAuthEmulator(auth, "http://localhost:9099");
  // }
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export { auth };
export default app;
