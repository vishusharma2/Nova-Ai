import { FaUserCircle, FaSignOutAlt, FaCog, FaBars } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const TOKEN_KEY = "chatbotToken";
const USER_KEY = "chatbotUser";

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
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
    <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl z-20 border-b border-white/5 transition-all duration-300">
      <div className="flex justify-between items-center px-4 lg:px-6 py-4">
        
        {/* Left side - Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-300"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/message")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                <img src="/logo.png" alt="logo" className="w-7 h-7 object-contain" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-white font-bold text-lg tracking-tight">Nova</h1>
              <span className="text-cyan-400 font-bold text-lg">AI</span>
              <HiSparkles className="text-cyan-400 w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs text-gray-400">Welcome back,</p>
              <p className="text-sm text-white font-medium">{username}</p>
            </div>
            {/* Dropdown arrow */}
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm font-medium text-white">{username}</p>
                <p className="text-xs text-gray-400">Free Plan</p>
              </div>
              
              {/* Menu items */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm"
                  onClick={() => {}}
                >
                  <FaCog className="w-4 h-4" />
                  Settings
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
