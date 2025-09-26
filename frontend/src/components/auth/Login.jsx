import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Bot, Sparkles, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatbotLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        // Save JWT token in localStorage
        localStorage.setItem("chatbotToken", data.token);
        // Navigate to protected route
        navigate("/message");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Background effects omitted for brevity; keep your previous JSX */}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r  rounded-2xl mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
                <img src="logo.png" alt="logo" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-white/70 text-lg flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Continue your AI conversation
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 bg-red-900/30 p-2 mb-4 rounded">{error}</div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-cyan-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting to AI...</span>
                  </div>
                ) : (
                  <>
                    <Bot className="w-5 h-5" />
                    Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/70">
                New here?{" "}
                <a href="/signup" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
