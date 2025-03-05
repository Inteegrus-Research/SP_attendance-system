import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC9REYPfvtv9QkhOdyopYHBj4ebYJhUGU",
  authDomain: "attendancesystem-32a61.firebaseapp.com",
  projectId: "attendancesystem-32a61",
  storageBucket: "attendancesystem-32a61.firebasestorage.app",
  messagingSenderId: "442360164771",
  appId: "1:442360164771:web:a06f15609d0f9eee4caa16",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
