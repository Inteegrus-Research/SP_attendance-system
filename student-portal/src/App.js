// student-portal/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentAuth from "./Auth";
import StudentDashboard from "./StudentDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentAuth />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App;
