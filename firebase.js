// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEp2lb7e4ZqFEiakGI83pfSrFpcf2Qe-8",
  authDomain: "inventory-management-17e85.firebaseapp.com",
  projectId: "inventory-management-17e85",
  storageBucket: "inventory-management-17e85.appspot.com",
  messagingSenderId: "1072395566458",
  appId: "1:1072395566458:web:8f20d93b5393286b04eac3",
  measurementId: "G-YMXFRWHCC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};