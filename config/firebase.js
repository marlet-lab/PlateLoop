// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5b-jG1cyLqwoGBjVaGSgu22Spdg4Bwsc",
  authDomain: "plateloop-e4307.firebaseapp.com",
  projectId: "plateloop-e4307",
  storageBucket: "plateloop-e4307.firebasestorage.app",
  messagingSenderId: "522012181785",
  appId: "1:522012181785:web:b6c4f54fbf768cdaaa7188",
  measurementId: "G-T1635EERZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const signOutUser = (auth) => signOut(auth);
export const auth = getAuth(app);
export const signUp = (auth,email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signIn = (auth,email, password) => signInWithEmailAndPassword(auth, email, password);
export const db = getFirestore(app);