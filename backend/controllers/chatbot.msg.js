import Conversation from "../models/conversation.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateImage, isImageGenerationRequest, extractImagePrompt } from "../utils/imageService.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Always detect creator-related questions (simple & robust)
const isAskingAboutModelCreator = (text) => {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes("who created you") ||
    lowerText.includes("who made you") ||
    lowerText.includes("who built you") ||
    lowerText.includes("who developed you") ||
    lowerText.includes("who is your creator") ||
    lowerText.includes("who is your developer") ||
    lowerText.includes("who designed you") ||
    lowerText.includes("who programmed you") ||
    lowerText.includes("created by") ||
    lowerText.includes("made by") ||
    lowerText.includes("developed by") ||
    lowerText.includes("aapko kisne bnaya hai?") ||
    lowerText.includes("aapko kisne bnaya hai ?") ||
    lowerText.includes("aap ko bnane wala kon hai ?") ||
    lowerText.includes("aap ko bnane wala kon hai?")
  );
};

// Predefined responses
const predefinedResponses = {
  "what is your name?": "I'm Nova AI, your intelligent assistant 🤖✨",
  "how are you?": "I'm doing great! Thanks for asking 😄",
  "what can you do?": "I can chat with you, answer questions, and help with tasks! 🧠✨",
};

// ==================== CONVERSATION MANAGEMENT ====================

// Get all conversations for logged-in user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({ userId })
      .select("_id title createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50);
    
    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch conversations",
    });
  }
};

// Get a specific conversation with messages
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    const conversation = await Conversation.findOne({ _id: id, userId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("❌ Error fetching conversation:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch conversation",
    });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversation = new Conversation({
      userId,
      title: "New Chat",
      messages: [],
    });
    
    await conversation.save();
    
    return res.status(201).json({
      success: true,
      conversationId: conversation._id,
      conversation,
    });
  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create conversation",
    });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    const result = await Conversation.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Conversation not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting conversation:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete conversation",
    });
  }
};

// ==================== MESSAGE HANDLER ====================

export const Message = async (req, res) => {
  try {
    const { text, conversationId } = req.body;
    const userId = req.user._id;

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Message text cannot be empty" });
    }

    console.log("📩 User input:", text);

    let botResponse = "";
    let imageUrl = null;
    const lowerText = text.trim().toLowerCase();

    // 0️⃣ Check for image generation request FIRST
    if (isImageGenerationRequest(text)) {
      console.log("🎨 Image generation request detected");
      const imagePrompt = extractImagePrompt(text);
      console.log("🎨 Extracted prompt:", imagePrompt);
      
      try {
        const imageResult = await generateImage(imagePrompt);
        
        if (imageResult.success) {
          botResponse = `Here's your generated image! 🎨✨`;
          imageUrl = `data:${imageResult.mimeType};base64,${imageResult.imageData}`;
          console.log("✅ Image generated successfully");
        } else {
          botResponse = `Sorry, I couldn't generate that image. ${imageResult.error || "Please try a different prompt."}`;
          console.log("❌ Image generation failed:", imageResult.error);
        }
      } catch (imageErr) {
        console.error("❌ Image generation exception:", imageErr);
        botResponse = `Sorry, there was an error generating the image: ${imageErr.message}`;
      }
    }
    // 1️⃣ "who created you" type questions
    else if (isAskingAboutModelCreator(text)) {
      botResponse = "I was created by Nova AI team 🤖💻";
      console.log("🎯 Model creator question detected");
    }
    // 2️⃣ Check predefined responses
    else if (predefinedResponses[lowerText]) {
      botResponse = predefinedResponses[lowerText];
    }
    // 3️⃣ Otherwise → call Gemini API
    else {
      try {
        const result = await model.generateContent(text);
        botResponse =
          result?.response?.text() || "Sorry, I couldn't generate a response.";
      } catch (err) {
        console.error("⚠️ Gemini API Error:", err);
        botResponse =
          "⚠️ The AI service is busy right now. Please try again later.";
      }
    }

    let conversation;

    // Build message objects
    const userMessage = { sender: "user", text: text.trim() };
    const botMessage = { 
      sender: "bot", 
      text: botResponse,
      ...(imageUrl && { imageUrl }) // Include imageUrl if present
    };

    if (conversationId) {
      // Update existing conversation (ensure it belongs to user)
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res
          .status(404)
          .json({ success: false, error: "Conversation not found" });
      }

      conversation.messages.push(userMessage, botMessage);
    } else {
      // Create new conversation for user
      conversation = new Conversation({
        userId,
        messages: [userMessage, botMessage],
      });
      // Auto-generate title from first message
      conversation.title = text.trim().slice(0, 50) + (text.trim().length > 50 ? "..." : "");
    }

    await conversation.save();

    // Send back latest message with optional image
    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      botMessage: botResponse,
      imageUrl: imageUrl, // Will be null if no image
      title: conversation.title,
    });
  } catch (error) {
    console.error("❌ Error in Message Controller:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};