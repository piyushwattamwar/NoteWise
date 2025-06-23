// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Debug: show if OpenAI key is loaded (REMOVE in production)
console.log("✅ OpenAI Key loaded:", !!process.env.OPENAI_API_KEY);

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import aiRoutes from "./routes/aiRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS configuration for deployment
app.use(
  cors({
    origin: [
      "https://notewise-frontend.onrender.com", // ✅ Replace with your Vercel domain
      "http://localhost:3000",                // ✅ Keep this for local testing
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

// Health Check Route
app.get("/api/ping", (req, res) => {
  res.json({ message: "✅ API is live!" });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the NoteWise API 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
