import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove JWT token from localStorage
    localStorage.removeItem("chatbotToken");

    // Optionally, clear other user-related data
    // localStorage.removeItem("userData");

    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      <h1 className="text-3xl font-bold">Logging out...</h1>
    </div>
  );
};

export default LogoutPage;
