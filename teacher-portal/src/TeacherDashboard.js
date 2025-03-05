import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { toast } from "sonner";

// Total students count
const TOTAL_STUDENTS = 72;

// Generate student emails
const allStudentEmails = Array.from({ length: 63 }, (_, i) =>
  `24ec0${64 + i}@kpriet.ac.in`
).concat([
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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacherEmail = auth.currentUser?.email;
  const [subject, setSubject] = useState("");
  const [period, setPeriod] = useState("");
  const [otpExpiryTime, setOtpExpiryTime] = useState(5);
  const [activeSession, setActiveSession] = useState(null);
  const [presentStudents, setPresentStudents] = useState([]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const createSession = async () => {
    if (!teacherEmail) {
      toast.error("No authenticated teacher found.");
      return;
    }
    if (!subject || !period) {
      toast.error("Please enter subject and period.");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + otpExpiryTime);

    try {
      const sessionRef = await addDoc(collection(db, "sessions"), {
        teacher: teacherEmail,
        subject,
        period,
        otp: newOtp,
        expiry: expiryTime.getTime(),
        createdAt: serverTimestamp(),
      });
      setActiveSession({
        id: sessionRef.id,
        teacher: teacherEmail,
        subject,
        period,
        otp: newOtp,
        expiry: expiryTime.getTime(),
      });
      toast.success(`Session created. OTP: ${newOtp} (Valid for ${otpExpiryTime} min)`);
    } catch (error) {
      toast.error("Failed to create session.");
    }
  };

  useEffect(() => {
    if (!teacherEmail) return;
    const fetchActiveSession = async () => {
      const now = Date.now();
      const q = query(
        collection(db, "sessions"),
        where("teacher", "==", teacherEmail),
        where("expiry", ">", now),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setActiveSession({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    };
    fetchActiveSession();
  }, [teacherEmail]);

  useEffect(() => {
    if (activeSession) {
      const unsubscribe = onSnapshot(
        collection(db, "sessions", activeSession.id, "attendance"),
        (snapshot) => {
          setPresentStudents(snapshot.docs.map((doc) => doc.id));
        }
      );
      return () => unsubscribe();
    }
  }, [activeSession]);

  const absentStudents = allStudentEmails.filter((email) => !presentStudents.includes(email));

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Teacher Dashboard</CardTitle>
          <p className="text-gray-600">Welcome, {teacherEmail}</p>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} className="mb-4">
            Logout
          </Button>
          <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <Input placeholder="Enter period" value={period} onChange={(e) => setPeriod(e.target.value)} />
            <Input
              type="number"
              value={otpExpiryTime}
              min="1"
              max="60"
              onChange={(e) => setOtpExpiryTime(Number(e.target.value))}
              placeholder="OTP Expiry Time (min)"
            />
          </div>
          <Button onClick={createSession} className="mt-4 w-full">
            Create Session & Generate OTP
          </Button>

          {activeSession && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Current Session</h3>
              <p>
                <strong>Subject:</strong> {activeSession.subject} | <strong>Period:</strong> {activeSession.period}
              </p>
              <p>
                <strong>OTP:</strong> {activeSession.otp} | <strong>Expires At:</strong>{" "}
                {new Date(activeSession.expiry).toLocaleString()}
              </p>
            </div>
          )}

          {activeSession && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Attendance</h3>
              <p>
                Present Students: {presentStudents.length} / {TOTAL_STUDENTS}
              </p>
              <div className="mt-2">
                <h4 className="font-medium">Present Students</h4>
                <ul className="list-disc pl-6">
                  {presentStudents.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="font-medium">Absent Students</h4>
                <ul className="list-disc pl-6 text-red-500">
                  {absentStudents.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
