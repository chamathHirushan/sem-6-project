// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnHoF9TZwCei_8gNf-aPPRV6pnf8bDasU",
  authDomain: "sewalk-a03c7.firebaseapp.com",
  projectId: "sewalk-a03c7",
  storageBucket: "sewalk-a03c7.firebasestorage.app",
  messagingSenderId: "360480960519",
  appId: "1:360480960519:web:a2d62c8549a14537e73aa2",
  measurementId: "G-BGQKX9K8HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);