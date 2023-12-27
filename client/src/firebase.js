// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "okazioni-9ffc2.firebaseapp.com",
  projectId: "okazioni-9ffc2",
  storageBucket: "okazioni-9ffc2.appspot.com",
  messagingSenderId: "180199993228",
  appId: "1:180199993228:web:cce028e0a1dfb98a6530a9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);