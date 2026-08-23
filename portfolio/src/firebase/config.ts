// ------------------------------------------------------------------
// Firebase setup. Values come from your .env file (see .env.example).
// You do NOT need to edit this file — just fill in your .env / Vercel
// environment variables with your own Firebase project's keys.
// ------------------------------------------------------------------
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXmdkPAuF6cedTWh1K84wBFMtID03LVkc",
  authDomain: "mitch-portfolio-6781c.firebaseapp.com",
  projectId: "mitch-portfolio-6781c",
  storageBucket: "mitch-portfolio-6781c.firebasestorage.app",
  messagingSenderId: "981856341676",
  appId: "1:981856341676:web:7e43217ee22ca76fa15909",
  measurementId: "G-LJGS0C25B4"
};

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export default app
