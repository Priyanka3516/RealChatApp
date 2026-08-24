import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBEgUcOYJsT5WrVFfKP-5Um-zE9QaoZQm0",
  authDomain: "realtimechatapp-54c5e.firebaseapp.com",
  databaseURL:
    "https://realtimechatapp-54c5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "realtimechatapp-54c5e",
  storageBucket: "realtimechatapp-54c5e.firebasestorage.app",
  messagingSenderId: "55479897736",
  appId: "1:55479897736:web:d24fabe56c5248d0b3993d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);

export default app;