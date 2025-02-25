import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBDVgENL7LVACWcj8W6dVkfoMSKann1rE",
  authDomain: "vehicle-managment-e0a67.firebaseapp.com",
  projectId: "vehicle-managment-e0a67",
  storageBucket: "vehicle-managment-e0a67.firebasestorage.app",
  messagingSenderId: "629456607812",
  appId: "1:629456607812:web:c3c96fbc954d2dccb8fa11",
  measurementId: "G-SV9BN8EYNV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

