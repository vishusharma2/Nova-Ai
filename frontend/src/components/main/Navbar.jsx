import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const TOKEN_KEY = "chatbotToken";
const USER_KEY = "chatbotUser";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed.username || "Guest");
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d]/95 backdrop-blur-sm z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/message")}
        >
          <img src="/logo.png" alt="logo" height={40} width={40} />
          <h1 className="text-white font-bold text-xl">Nova AI</h1>
        </div>

        {/* User Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-white/80 hover:text-cyan-400 transition-colors font-semibold"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={28} />
            <span className="text-lg">Hello, {username}</span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg overflow-hidden z-20">
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
