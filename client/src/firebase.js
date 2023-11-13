// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-59bff.firebaseapp.com",
  projectId: "mern-realestate-59bff",
  storageBucket: "mern-realestate-59bff.appspot.com",
  messagingSenderId: "1074347821025",
  appId: "1:1074347821025:web:0e575a8bfe65e5ed2234a0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
