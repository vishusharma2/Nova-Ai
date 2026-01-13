import { FaPaperPlane } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Footer = ({ input, setInput, handleKeyPress, handleSendMessage, loading, sidebarOpen }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-8 pb-4 z-10 transition-all duration-300 ${sidebarOpen ? "lg:pl-72" : ""}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Input container with glassmorphism */}
        <div className="relative group">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all duration-300" />
          
          <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-2xl border border-white/10">
            {/* AI indicator */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
              <HiSparkles className="text-cyan-400 w-5 h-5" />
              <span className="text-xs text-gray-500 hidden sm:block">Nova AI</span>
            </div>
            
            <input
              type="text"
              aria-label="Chat message"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 px-4 py-2 text-[15px]"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            
            {/* Character count */}
            {input.length > 0 && (
              <span className="text-xs text-gray-500 mr-3">{input.length}/2000</span>
            )}
            
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className={`relative px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-300 ${
                loading || !input.trim()
                  ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <FaPaperPlane className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Powered by text */}
        <p className="text-center text-xs text-gray-600 mt-3">
          Powered by Nova AI • Built with ❤️
        </p>
      </div>
    </footer>
  );
};

export default Footer;
