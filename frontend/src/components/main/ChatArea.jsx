const ChatArea = ({ messages, loading, messagesEndRef, setInput, sidebarOpen }) => {
  const suggestions = [
    { emoji: "💡", text: "Explain quantum computing" },
    { emoji: "✍️", text: "Write a poem" },
    { emoji: "🧠", text: "Help me brainstorm" },
    { emoji: "📚", text: "Summarize a topic" },
  ];

  const handleSuggestionClick = (text) => {
    if (setInput) {
      setInput(text);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto pt-24 pb-28">
      {/* Gradient background overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-6 mt-24">
            {/* Animated logo container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                <span className="text-5xl">👋</span>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Welcome to Nova AI
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Your intelligent AI companion. Ask me anything and let's explore ideas together!
              </p>
            </div>
            
            {/* Suggestion chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-xl">
              {suggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {suggestion.emoji} {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`relative group max-w-[80%] ${
                msg.sender === "user"
                  ? "ml-12"
                  : "mr-12"
              }`}
            >
              {/* Avatar */}
              <div className={`absolute top-0 ${msg.sender === "user" ? "-right-10" : "-left-10"} w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                msg.sender === "user" 
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                  : "bg-gradient-to-br from-purple-500 to-pink-600"
              }`}>
                {msg.sender === "user" ? "👤" : "🤖"}
              </div>
              
              {/* Message bubble */}
              <div
                className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-cyan-600/90 to-blue-700/90 text-white rounded-tr-sm border border-cyan-500/30"
                    : "bg-white/5 text-gray-100 rounded-tl-sm border border-white/10"
                } ${msg.isError ? "bg-red-500/30 border-red-500/50" : ""}`}
              >
                {msg.sender === "bot" && (
                  <div className="text-xs text-purple-400 font-medium mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Nova AI
                  </div>
                )}
                <div className="leading-relaxed whitespace-pre-wrap break-words text-[15px]">
                  {msg.text}
                </div>
                
                {/* Display image if present */}
                {msg.imageUrl && (
                  <div className="mt-4 relative group/img">
                    <img 
                      src={msg.imageUrl} 
                      alt="AI Generated" 
                      className="rounded-xl max-w-full h-auto shadow-lg border border-white/10 hover:scale-[1.02] transition-transform cursor-pointer"
                      onClick={() => window.open(msg.imageUrl, '_blank')}
                    />
                    {/* Download button */}
                    <a 
                      href={msg.imageUrl}
                      download={`nova-ai-image-${Date.now()}.png`}
                      className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-sm border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="ml-2 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 px-5 py-4 rounded-2xl rounded-tl-sm shadow-lg">
              <div className="text-xs text-purple-400 font-medium mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Nova AI is thinking...
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatArea;
