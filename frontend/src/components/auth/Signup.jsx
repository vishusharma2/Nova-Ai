import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Bot, MessageCircle, ArrowRight, Check, Brain, Zap, Sparkles } from "lucide-react";

export default function ChatbotSignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    useCase: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const useCases = [
    "Personal Assistant",
    "Business Automation",
    "Customer Support",
    "Content Creation",
    "Research & Learning",
    "Creative Writing",
    "Other"
  ];

  const experienceLevels = [
    "New to AI",
    "Some Experience",
    "Advanced User",
    "AI Developer"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!agreedToTerms) {
      setErrorMessage("You must agree to the Terms of Service and AI Usage Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (!formData.username || !formData.email || !formData.useCase || !formData.experience) {
      setErrorMessage("Please fill in all required fields!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4002/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          useCase: formData.useCase,
          experience: formData.experience
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          useCase: "",
          experience: ""
        });
        // Redirect to login after 2s
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
              <img src="logo.png" alt="logo" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Join Nova AI
            </h1>
            <p className="text-white/70 text-lg flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" />
              Start your intelligent conversation journey
            </p>
          </div>

          {/* Error / Success Messages */}
          {errorMessage && (
            <div className="mb-4 text-red-400 font-medium">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-400 font-medium">{successMessage}</div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {/* Username */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Choose your username"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                required
              />
            </div>

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

           {/* Use Case Dropdown */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <MessageCircle className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <select
                  value={formData.useCase}
                  onChange={(e) => handleInputChange('useCase', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-800 text-white">What will you use the chatbot for?</option>
                  {useCases.map((useCase) => (
                    <option key={useCase} value={useCase} className="bg-slate-800 text-white">
                      {useCase}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Zap className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-800 text-white">Your AI experience level?</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level} className="bg-slate-800 text-white">
                      {level}
                    </option>
                  ))}
                </select>
              </div>

            {/* Password */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create password"
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

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-cyan-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="w-5 h-5 rounded border-white/30 focus:ring-cyan-400 accent-cyan-500"
              />
              <label className="text-white/70 text-sm">
                I agree to the{" "}
                <a href="#" className="text-cyan-300 font-medium">Terms of Service</a> and{" "}
                <a href="#" className="text-cyan-300 font-medium">AI Usage Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initializing AI...
                </div>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Start Chatting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="mt-6 text-center text-white/70">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-300 font-semibold hover:text-cyan-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
