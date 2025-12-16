// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "eatsync-a97db.firebaseapp.com",
  projectId: "eatsync-a97db",
  storageBucket: "eatsync-a97db.firebasestorage.app",
  messagingSenderId: "422295098128",
  appId: "1:422295098128:web:a0e577189806379ace0b95",
  measurementId: "G-LHPPMRM6GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app,auth}