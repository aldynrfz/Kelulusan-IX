import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5qMKxocHv5juRzJNBjVWNXwTl5L4WdV4",
  authDomain: "portal-kelulusan-ix.firebaseapp.com",
  projectId: "portal-kelulusan-ix",
  storageBucket: "portal-kelulusan-ix.firebasestorage.app",
  messagingSenderId: "326091039670",
  appId: "1:326091039670:web:2d5bafcbeeddc42e2f9717"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
