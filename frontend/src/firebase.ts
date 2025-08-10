import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnTszVHUE71BBq0Wg9KN328KxnoJmhcmk",
  authDomain: "vguard-d7ca7.firebaseapp.com",
  projectId: "vguard-d7ca7",
  storageBucket: "vguard-d7ca7.firebasestorage.app",
  messagingSenderId: "541688771224",
  appId: "1:541688771224:web:b3b62f680a78e5f64556ed",
  measurementId: "G-NLK45153SF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
