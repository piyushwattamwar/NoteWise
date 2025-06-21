import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Title Suggestion — Refined Prompt for SHORT Titles
export const suggestTitle = async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise and meaningful titles. The title should summarize the note in 3–6 words.",
        },
        {
          role: "user",
          content: `Generate a short, meaningful title for this note:\n\n"${content}"`,
        },
      ],
      temperature: 0.5,
      max_tokens: 25,
    });

    const title = completion.choices?.[0]?.message?.content?.trim();

    if (!title) {
      return res
        .status(500)
        .json({ message: "AI did not return a valid title." });
    }

    res.json({ title });
  } catch (error) {
    console.error("🔴 Title Suggestion Error:", error);
    res.status(500).json({
      message: "Failed to suggest title",
      error: error?.message || "Unknown error",
    });
  }
};

export const suggestCategory = async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a smart assistant that classifies notes into one of the following categories: Work, Personal, Ideas, Tasks, or Learning. Respond with only the most appropriate category.",
        },
        {
          role: "user",
          content: `Which category best fits this note?\n\n"${content}"`,
        },
      ],
      temperature: 0.4,
      max_tokens: 10,
    });

    const category = completion.choices?.[0]?.message?.content?.trim();

    if (!category) {
      return res
        .status(500)
        .json({ message: "AI did not return a valid category." });
    }

    res.json({ category });
  } catch (error) {
    console.error("🔴 Category Suggestion Error:", error);
    res.status(500).json({
      message: "Failed to suggest category",
      error: error?.message || "Unknown error",
    });
  }
};
