import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const HF_API_KEY = process.env.HF_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!HF_API_KEY) console.error("❌ Hugging Face API key not found");
if (!COHERE_API_KEY) console.error("❌ Cohere API key not found");

const HF_HEADERS = {
  Authorization: `Bearer ${HF_API_KEY}`,
  "Content-Type": "application/json",
};

const COHERE_HEADERS = {
  Authorization: `Bearer ${COHERE_API_KEY}`,
  "Content-Type": "application/json",
};

router.post("/suggest-title", async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ message: "Note content is required" });
  }

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-nightly",
        message: `Generate a short and meaningful title (max 6 words) for the following note:\n\n"${content}"`,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const title = response.data?.text?.trim();
    if (!title) throw new Error("No title generated");

    res.json({ title });
  } catch (err) {
    console.error("🔴 Cohere Title Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to generate title" });
  }
});
router.post("/suggest-category", async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Note content required" });

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: content,
        parameters: {
          candidate_labels: ["Work", "Ideas", "Personal", "Other"],
        },
      },
      { headers: HF_HEADERS }
    );

    const topCategory = response.data?.labels?.[0] || "Other";
    res.json({ category: topCategory });
  } catch (err) {
    console.error("🔴 HF Category Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to suggest category" });
  }
});

router.post("/summarize", async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Note content required" });

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: content },
      { headers: HF_HEADERS }
    );

    const summary = response.data[0]?.summary_text?.trim() || "Summary not available";
    res.json({ summary });
  } catch (err) {
    console.error("🔴 HF Summary Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to summarize note" });
  }
});

router.post("/generate-mcq", async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Note content required" });

  try {
    const prompt = `Generate 5 multiple choice questions based on the following text. Format each as:
Q: [question]
A. Option 1
B. Option 2
C. Option 3
D. Option 4
Answer: [letter]

Text:
"${content}"`;

    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      },
      { headers: COHERE_HEADERS }
    );

    const rawText = response.data.generations[0].text;

    const questions = rawText
      .split(/Q:\s?/i)
      .slice(1)
      .map((block) => {
        const lines = block.trim().split("\n").filter(Boolean);
        const question = lines[0];
        const options = lines.slice(1, 5).map((line) => line.slice(3).trim()); // A. text
        const answerLine = lines.find((l) => /^answer:/i.test(l));
        const letter = answerLine?.trim().split(":")[1]?.trim()?.toUpperCase();
        const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[letter];
        const correct = options[correctIndex];

        return {
          question,
          options: options.map((opt) => ({
            option: opt,
            correct: opt === correct,
          })),
        };
      })
      .filter((q) => q.question && q.options?.length === 4); // basic cleanup

    res.json({ questions });
  } catch (err) {
    console.error("🔴 Cohere MCQ Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to generate MCQs", error: err.message });
  }
});

export default router;
