import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatArea from "./ChatArea";

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
    }, 30); // speed (ms) per character
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Append user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: input.trim() }]);

    try {
      const res = await axios.post(`${API_URL}/bot/v1/message`, {
        text: input,
        conversationId,
      });

      if (res.status === 200 && res.data?.botMessage) {
        // Add placeholder for bot message
        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

        // Start typing effect
        typeBotMessage(res.data.botMessage);

        // Save conversationId if new
        if (!conversationId && res.data.conversationId) {
          setConversationId(res.data.conversationId);
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
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      {/* Navbar */}
      <Navbar />
      {/* Chat area */}
      <ChatArea
        messages={messages}
        loading={loading}
        messagesEndRef={messagesEndRef}
      />

      {/* Footer & Input */}
      <Footer
        input={input}
        setInput={setInput}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
        loading={loading}
      />
    </div>
  );
}

export default Bot;
