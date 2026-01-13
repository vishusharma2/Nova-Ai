import { useState } from "react";
import { FaPlus, FaTrash, FaComments, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const Sidebar = ({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewChat, 
  onDeleteConversation,
  loading 
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-950/95 backdrop-blur-xl border-r border-white/10 z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HiSparkles className="text-cyan-400 w-5 h-5" />
                <span className="text-white font-semibold">Chat History</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            
            {/* New Chat Button */}
            <button
              onClick={() => {
                onNewChat();
                // Close sidebar on mobile after creating new chat
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
            >
              <FaPlus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <FaComments className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No conversations yet</p>
                <p className="text-gray-600 text-xs mt-1">Start a new chat!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentConversationId === conv._id
                      ? "bg-cyan-500/20 border border-cyan-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                  onClick={() => {
                    onSelectConversation(conv._id);
                    // Close sidebar on mobile after selecting
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setHoveredId(conv._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentConversationId === conv._id
                      ? "bg-cyan-500/30 text-cyan-400"
                      : "bg-white/5 text-gray-400"
                  }`}>
                    <FaComments className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      currentConversationId === conv._id ? "text-white" : "text-gray-300"
                    }`}>
                      {conv.title || "New Chat"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(conv.updatedAt)}
                    </p>
                  </div>

                  {/* Delete button */}
                  {(hoveredId === conv._id || currentConversationId === conv._id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv._id);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Delete conversation"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
