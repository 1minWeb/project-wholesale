import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDHKFtJ6T2H-XB0SUSZJPkeR3ds2HnL4v0",
  authDomain: "cloth-test-f1eee.firebaseapp.com",
  projectId: "cloth-test-f1eee",
  storageBucket: "cloth-test-f1eee.firebasestorage.app",
  messagingSenderId: "611264404134",
  appId: "1:611264404134:web:631eb0345a55bff183f267",
  measurementId: "G-BJE60Y0KLC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);