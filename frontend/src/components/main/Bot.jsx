import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatArea from "./ChatArea";
import Sidebar from "./Sidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4002";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("chatbotToken");
    return { Authorization: `Bearer ${token}` };
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${API_URL}/bot/v1/conversations`, {
        headers: getAuthHeaders(),
      });
      if (res.data?.conversations) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadConversation = async (convId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bot/v1/conversations/${convId}`, {
        headers: getAuthHeaders(),
      });
      if (res.data?.conversation) {
        setConversationId(convId);
        setMessages(res.data.conversation.messages.map(m => ({
          sender: m.sender,
          text: m.text,
        })));
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await axios.delete(`${API_URL}/bot/v1/conversations/${convId}`, {
        headers: getAuthHeaders(),
      });
      // Remove from local state
      setConversations(prev => prev.filter(c => c._id !== convId));
      // If we deleted the current conversation, clear it
      if (conversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  // Typing effect for bot response (letter by letter)
  const typeBotMessage = (fullText) => {
    let currentText = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setMessages((prev) => {
          let updated = [...prev];
          updated[updated.length - 1] = { sender: "bot", text: currentText };
          return updated;
        });
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Append user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);

    try {
      const res = await axios.post(
        `${API_URL}/bot/v1/message`,
        { text: input, conversationId },
        { headers: getAuthHeaders() }
      );

      if (res.status === 200 && res.data?.botMessage) {
        // Add placeholder for bot message
        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

        // Start typing effect
        typeBotMessage(res.data.botMessage);

        // Save conversationId if new
        if (!conversationId && res.data.conversationId) {
          setConversationId(res.data.conversationId);
          // Refresh conversations list
          fetchConversations();
        } else {
          // Update existing conversation in list
          setConversations(prev => prev.map(c => 
            c._id === conversationId 
              ? { ...c, updatedAt: new Date().toISOString() }
              : c
          ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong!", isError: true },
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
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        loading={historyLoading}
      />

      {/* Main content - adjusts based on sidebar state */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:pl-72" : ""}`}>
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        
        {/* Chat area */}
        <ChatArea
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
          setInput={setInput}
          sidebarOpen={sidebarOpen}
        />

        {/* Footer & Input */}
        <Footer
          input={input}
          setInput={setInput}
          handleKeyPress={handleKeyPress}
          handleSendMessage={handleSendMessage}
          loading={loading}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
}

export default Bot;
