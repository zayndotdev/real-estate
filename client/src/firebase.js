// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-a55ce.firebaseapp.com",
  projectId: "real-estate-a55ce",
  //   storageBucket: "real-estate-a55ce.firebasestorage.app",
  storageBucket: "real-estate-a55ce.appspot.com",
  messagingSenderId: "959325288122",
  appId: "1:959325288122:web:66f6376b299da811be7483",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
