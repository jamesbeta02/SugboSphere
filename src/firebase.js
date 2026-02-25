import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8e0fatpGQTl7xL5qvk75H6XmzcgODAt4",
  authDomain: "sugbosphere.firebaseapp.com",
  projectId: "sugbosphere",
  storageBucket: "sugbosphere.appspot.com",
  messagingSenderId: "1008529911808",
  appId: "1:1008529911808:web:f5cc75e5f89d0387c368e5",
  measurementId: "G-5JJKLV9ZBB"
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);