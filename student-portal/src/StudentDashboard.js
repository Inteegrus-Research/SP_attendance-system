import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { toast } from "sonner";

const StudentDashboard = () => {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const navigate = useNavigate();
  const studentEmail = auth.currentUser?.email;

  // Fetch the latest active session (with expiry in the future)
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const sessionsRef = collection(db, "sessions");
        const now = new Date().getTime();
        const q = query(sessionsRef, orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const sessionDoc = snapshot.docs[0];
          const sessionData = sessionDoc.data();
          if (sessionData.expiry > now) {
            setActiveSession({ id: sessionDoc.id, ...sessionData });
            checkAttendance(sessionDoc.id); // Check if student has already marked attendance
          } else {
            setActiveSession(null);
          }
        }
      } catch (error) {
        toast.error("Error fetching session data.");
      }
    };
    fetchActiveSession();
  }, []);

  // Check if student has already marked attendance
  const checkAttendance = async (sessionId) => {
    if (!sessionId || !studentEmail) return;

    try {
      const attendanceRef = doc(db, "sessions", sessionId, "attendance", studentEmail);
      const attendanceSnap = await getDoc(attendanceRef);

      if (attendanceSnap.exists()) {
        setAttendanceMarked(true); // Update state if attendance already marked
      }
    } catch (error) {
      console.error("Error checking attendance:", error);
    }
  };

  const markAttendance = async () => {
    if (!activeSession) {
      toast.error("❌ No active session found.");
      return;
    }
  
    if (attendanceMarked) {
      toast.info("ℹ You have already marked attendance for this session.");
      return;
    }
  
    const currentTime = new Date().getTime();
    if (currentTime > activeSession.expiry) {
      toast.error("⚠ OTP expired. Ask your teacher for a new OTP.");
      return;
    }
  
    // ✅ FIX: Ensure incorrect OTP always triggers a response!
    if (enteredOtp.trim() !== activeSession.otp) {
      toast.error("❌ Incorrect OTP. Please try again.");
      return;
    }
  
    try {
      await setDoc(doc(db, "sessions", activeSession.id, "attendance", studentEmail), {
        email: studentEmail,
        timestamp: serverTimestamp(),
      });
  
      setAttendanceMarked(true); // Update UI to show attendance is recorded
      setEnteredOtp(""); // Clear input
      toast.success("✅ Attendance marked successfully!");
    } catch (error) {
      toast.error("⚠ Error marking attendance. Please try again.");
    }
  };
  

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Student Dashboard</CardTitle>
          <p className="text-gray-600">Welcome, {studentEmail}</p>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} className="mb-4 w-full">
            Logout
          </Button>

          {activeSession ? (
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Current Session</h3>
              <p>
                <strong>Subject:</strong> {activeSession.subject} |{" "}
                <strong>Period:</strong> {activeSession.period}
              </p>
              <p className="text-red-600 font-medium">
                ⚠ OTP Expires At: {new Date(activeSession.expiry).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active session at the moment.</p>
          )}

          {!attendanceMarked ? (
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
              <Button onClick={markAttendance} className="w-full">
                Submit OTP
              </Button>
            </div>
          ) : (
            <p className="text-green-600 font-semibold mt-4">
              ✅ Your attendance has been recorded!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
