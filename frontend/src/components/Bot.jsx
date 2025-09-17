import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4002";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Append user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);

    try {
      const res = await axios.post(`${API_URL}/bot/v1/message`, {
        text: input,
        conversationId
      });

      if (res.status === 200) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.botMessage }
        ]);

        // Save conversationId if new
        if (!conversationId) setConversationId(res.data.conversationId);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong!", isError: true }
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d]/95 backdrop-blur-sm z-10">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <img src="/logo.png" alt="logo" height={35} width={35} />
          <FaUserCircle size={30} className="text-gray-400 hover:text-green-500 transition-colors cursor-pointer" />
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center space-y-4 mt-20">
              <div className="text-5xl">👋</div>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Chatboat</h2>
                <p className="text-gray-400">Ask me anything! I'm here to help.</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] relative ${
                  msg.sender === "user"
                    ? "bg-blue-700 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:border-8 after:border-transparent after:border-r-blue-700"
                    : "bg-gray-800 text-gray-100"
                } ${msg.isError ? "bg-red-500/50" : ""}`}
              >
                <div className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-300 px-4 py-3 rounded-2xl">
                <div className="text-xs text-gray-400 mb-1">Chatboat</div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer & Input */}
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
    </div>
  );
}

export default Bot;
