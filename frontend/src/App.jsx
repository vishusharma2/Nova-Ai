import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Bot from "./components/main/Bot";
import SignupPage from "./components/auth/Signup";
import LoginPage from "./components/auth/Login";

// Token key constant
const TOKEN_KEY = "chatbotToken";

// ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from login/signup
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? <Navigate to="/message" replace /> : children;
};

// Logout page
const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and user info
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("chatbotUser");
    
    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <h1 className="text-3xl font-bold">Logging out...</h1>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected route */}
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <Bot />
            </ProtectedRoute>
          }
        />

        {/* Logout route */}
        <Route path="/logout" element={<LogoutPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
