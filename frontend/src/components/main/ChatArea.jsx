const ChatArea = ({ messages, loading, messagesEndRef }) => {
  return (
    <main className="flex-1 overflow-y-auto pt-20 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-4 mt-20">
            <div className="text-5xl">👋</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Nova Ai</h2>
              <p className="text-gray-400">Ask me anything! I'm here to help.</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[75%] relative ${
                msg.sender === "user"
                  ? "bg-blue-700 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:border-8 after:border-transparent after:border-r-blue-700"
                  : "bg-gray-800 text-gray-100"
              } ${msg.isError ? "bg-red-500/50" : ""}`}
            >
              <div className="leading-relaxed whitespace-pre-wrap break-words">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-300 px-4 py-3 rounded-2xl">
              <div className="text-xs text-gray-400 mb-1">Nova Ai</div>
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
  );
};

export default ChatArea;
