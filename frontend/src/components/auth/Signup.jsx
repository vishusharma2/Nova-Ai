import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Bot, MessageCircle, ArrowRight, Check, Sparkles, Brain, Zap } from 'lucide-react';

export default function ChatbotSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    useCase: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const useCases = [
    'Personal Assistant',
    'Business Automation',
    'Customer Support',
    'Content Creation',
    'Research & Learning',
    'Creative Writing',
    'Other'
  ];

  const experienceLevels = [
    'New to AI',
    'Some Experience',
    'Advanced User',
    'AI Developer'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.username || !formData.email || !formData.useCase || !formData.experience) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
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
        alert(data.message);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          useCase: '',
          experience: ''
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Neural Network Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 left-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-1 h-1 bg-cyan-300 rounded-full animate-pulse animation-delay-3000"></div>
        <div className="absolute top-16 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-4000"></div>
        <div className="absolute top-36 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-5000"></div>
        <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse animation-delay-6000"></div>
        <div className="absolute bottom-32 right-24 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <line x1="40" y1="80" x2="128" y2="80" stroke="url(#lineGradient)" strokeWidth="1"/>
          <line x1="128" y1="80" x2="80" y2="128" stroke="url(#lineGradient)" strokeWidth="1"/>
          <line x1="80" y1="128" x2="160" y2="160" stroke="url(#lineGradient)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-3000"></div>
      </div>

      {/* Floating AI Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 12 + 8}px`,
              animationDelay: `${Math.random() * 10}s`,
              animation: 'floatAI 12s ease-in-out infinite'
            }}
          >
            {i % 4 === 0 ? '◇' : i % 4 === 1 ? '◆' : i % 4 === 2 ? '○' : '●'}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-lg">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center transform hover:rotate-12 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 animate-pulse"></div>
                <Bot className="w-12 h-12 text-white relative z-10" />
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
                Join AI Chat
              </h1>
              <p className="text-white/70 text-lg flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Start your intelligent conversation journey
              </p>
            </div>

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
                  onChange={(e) => handleInputChange('username', e.target.value)}
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create secure password"
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
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
              <div className="flex items-start space-x-3 pt-2">
                <button
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                    agreedToTerms 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-cyan-400 shadow-cyan-500/50 shadow-lg' 
                      : 'border-white/30 hover:border-white/50'
                  }`}
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </button>
                <p className="text-white/70 text-sm leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors">
                    AI Usage Policy
                  </a>
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !agreedToTerms}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Initializing AI...</span>
                  </div>
                ) : (
                  <>
                    <Bot className="w-5 h-5" />
                    Start Chatting
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/70">
                Already have an account?{' '}
                <a href="#" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatAI {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); opacity: 0.4; }
          50% { transform: translateY(-10px) translateX(-10px) rotate(180deg); opacity: 0.6; }
          75% { transform: translateY(-15px) translateX(5px) rotate(270deg); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
