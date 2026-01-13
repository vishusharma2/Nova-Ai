import express from "express";
import { Message, getConversations, getConversation, deleteConversation, createConversation } from "../controllers/chatbot.msg.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Message endpoint (protected)
router.post("/message", protect, Message);

// Conversation management endpoints (all protected)
router.get("/conversations", protect, getConversations);
router.get("/conversations/:id", protect, getConversation);
router.post("/conversations/new", protect, createConversation);
router.delete("/conversations/:id", protect, deleteConversation);

export default router;
