import { FaPaperPlane } from "react-icons/fa";

const Footer = ({ input, setInput, handleKeyPress, handleSendMessage, loading }) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d]/95 backdrop-blur-sm z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex bg-gray-800/50 rounded-xl px-4 py-2 shadow-lg border border-gray-700/50">
          <input
            type="text"
            aria-label="Chat message"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              loading || !input.trim()
                ? "bg-green-600/30 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            <span>{loading ? "Sending..." : "Send"}</span>
            <FaPaperPlane className={loading ? "opacity-50" : ""} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
