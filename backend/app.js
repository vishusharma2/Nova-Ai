import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import chatbotRoutes from "./routes/chatbot.route.js";
import authRoutes from "./routes/auth.route.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// --- Middleware ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://35.154.90.250:5173", // frontend dev
  "http://35.154.90.250", // production or deployed build
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get("/health", (req, res) => res.status(200).json({ status: "UP" }));
app.use("/api/auth", authRoutes); // login, signup, logout
app.use("/bot/v1", chatbotRoutes); // chatbot message route

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Server Startup ---
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});

export default app;
