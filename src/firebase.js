// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyB6QCrPhPmAC9VpGfA-u4IEafndNcGbNnI",
  authDomain: "thegeekgames-b6d1f.firebaseapp.com",
  projectId: "thegeekgames-b6d1f",
  storageBucket: "thegeekgames-b6d1f.firebasestorage.app",
  messagingSenderId: "261716654135",
  appId: "1:261716654135:web:cde103fe79cde34ad627b2",
  measurementId: "G-FQ685VV0QS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
