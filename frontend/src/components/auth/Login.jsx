import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Bot, Sparkles, Brain, MessageCircle, Zap } from 'lucide-react';

export default function ChatbotLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate AI authentication
    setTimeout(() => setIsLoading(false), 2500);
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
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse animation-delay-7000"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse animation-delay-8000"></div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <line x1="40" y1="80" x2="128" y2="80" stroke="url(#lineGradient)" strokeWidth="1"/>
          <line x1="128" y1="80" x2="80" y2="128" stroke="url(#lineGradient)" strokeWidth="1"/>
          <line x1="80" y1="128" x2="160" y2="160" stroke="url(#lineGradient)" strokeWidth="1"/>
          <line x1="160" y1="64" x2="80" y2="144" stroke="url(#lineGradient2)" strokeWidth="1"/>
          <line x1="320" y1="80" x2="260" y2="140" stroke="url(#lineGradient)" strokeWidth="1"/>
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
        {[...Array(12)].map((_, i) => (
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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center transform hover:rotate-12 transition-transform duration-500 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 animate-pulse"></div>
                <Bot className="w-12 h-12 text-white relative z-10" />
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
                <MessageCircle className="absolute bottom-2 left-2 w-4 h-4 text-blue-300 animate-pulse animation-delay-1000" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-white/70 text-lg flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" />
                Continue your AI conversation
              </p>
            </div>

            {/* Quick Stats or Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <MessageCircle className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-white/60">Smart Chat</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-white/60">Instant AI</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <Brain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-white/60">Learn &amp; Adapt</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-cyan-300 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm focus:shadow-cyan-500/20 focus:shadow-lg"
                  placeholder="Enter your password"
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

              {/* Submit Button */}
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
                    Start Chatting
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* AI Features Highlight */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/80">AI-Powered Features</span>
              </div>
              <p className="text-xs text-white/60">
                Experience intelligent conversations, contextual understanding, and personalized responses tailored to your needs.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-white/70">
                New to our AI platform?{' '}
                <a href="/signup" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors">
                  Create account
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
          75% { transform: translateY(-15px) translateX(5px) rotate(270deg); opacity: 0.3; }
        }
        
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-6000 { animation-delay: 6s; }
        .animation-delay-7000 { animation-delay: 7s; }
        .animation-delay-8000 { animation-delay: 8s; }
      `}</style>
    </div>
  );
}