// student-portal/src/Auth.js
import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const allowedStudentEmails = new Set([
  ...Array.from({ length: 63 }, (_, i) => `24ec0${64 + i}@kpriet.ac.in`),
  "24ec191@kpriet.ac.in",
  "24ec192@kpriet.ac.in",
  "24ec194@kpriet.ac.in",
  "24ec195@kpriet.ac.in",
  "24ec197@kpriet.ac.in",
  "24ec198@kpriet.ac.in",
  "24ec199@kpriet.ac.in",
  "24ec201@kpriet.ac.in",
  "24ec202@kpriet.ac.in",
]);

function StudentAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (!allowedStudentEmails.has(currentUser.email)) {
          alert("Access Denied: This portal is for students only.");
          auth.signOut();
        } else {
          setUser(currentUser);
          navigate("/student-dashboard");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Student Portal: Sign in to Continue</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default StudentAuth;
