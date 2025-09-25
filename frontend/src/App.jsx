import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Bot from "./components/main/Bot";
import SignupPage from "./components/auth/Signup";
import LoginPage from "./components/auth/Login"; // 👈 file should be capitalized properly

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route path="/message" element={<Bot />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
