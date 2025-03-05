// teacher-portal/src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import TeacherAuth from "./Auth";
import TeacherDashboard from "./TeacherDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherAuth />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;
