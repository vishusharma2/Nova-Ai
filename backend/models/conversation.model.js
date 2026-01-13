import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: "New Chat",
    maxlength: 100,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto update `updatedAt` on save
conversationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-generate title from first user message if not set
conversationSchema.methods.generateTitle = function () {
  if (this.messages.length > 0) {
    const firstUserMsg = this.messages.find(m => m.sender === "user");
    if (firstUserMsg) {
      // Take first 50 chars of first user message
      this.title = firstUserMsg.text.slice(0, 50) + (firstUserMsg.text.length > 50 ? "..." : "");
    }
  }
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
