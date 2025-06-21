
import dotenv from "dotenv";
dotenv.config(); 

console.log("OpenAI Key:", process.env.OPENAI_API_KEY);


import express from "express";

import cors from "cors";
import connectDB from "./config/db.js";


import aiRoutes from "./routes/aiRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api/auth", authRoutes);     
app.use("/api/users", userRoutes);    
app.use("/api/notes", noteRoutes);    
app.use("/api/ai", aiRoutes);         

app.use("/", (req, res) => {
  res.send("Welcome to the NoteWise API 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
