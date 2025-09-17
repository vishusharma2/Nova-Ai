import Conversation from "../models/conversation.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Predefined responses
const predefinedResponses = {
  "who created you?": "I was created by Nova AI team 🤖💻",
  "what is your name?": "I'm Chatboat, your friendly AI assistant 🛳️🤖",
  "how are you?": "I'm doing great! Thanks for asking 😄",
  "what can you do?": "I can chat with you, answer questions, and help with tasks! 🧠✨"
};

export const Message = async (req, res) => {
  try {
    const { text, conversationId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "Message text cannot be empty" });
    }

    console.log("📩 User input:", text);

    let botResponse = "";
    const lowerText = text.trim().toLowerCase();

    // Check predefined responses first
    if (predefinedResponses[lowerText]) {
      botResponse = predefinedResponses[lowerText];
    } else {
      // Call Gemini API
      try {
        const result = await model.generateContent(text);
        botResponse = result?.response?.text() || "Sorry, I couldn’t generate a response.";
      } catch (err) {
        console.error("⚠️ Gemini API Error:", err);
        botResponse = "⚠️ Error fetching response from AI.";
      }
    }

    let conversation;

    if (conversationId) {
      // Update existing conversation
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, error: "Conversation not found" });
      }

      conversation.messages.push(
        { sender: "user", text: text.trim() },
        { sender: "bot", text: botResponse }
      );
    } else {
      // Create new conversation
      conversation = new Conversation({
        messages: [
          { sender: "user", text: text.trim() },
          { sender: "bot", text: botResponse },
        ],
      });
    }

    await conversation.save();

    // Return only the latest bot message to avoid sending full conversation each time
    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      botMessage: botResponse
    });

  } catch (error) {
    console.error("❌ Error in Message Controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
};
