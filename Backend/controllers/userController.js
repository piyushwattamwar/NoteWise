import Note from "../models/Note.js";
import User from "../models/User.js"; 

export const getUserProfile = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });

    const pinnedCount = notes.filter((n) => n.pinned).length;

    const categories = notes.reduce((acc, note) => {
      const key = note.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const lastEdited = notes.length
      ? new Date(Math.max(...notes.map((n) => new Date(n.updatedAt)))).toISOString()
      : null;

    const user = await User.findById(req.user._id); 

    res.json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      scores: user.scores || [], 
      stats: {
        total: notes.length,
        pinned: pinnedCount,
        categories,
        lastEdited,
      },
    });
  } catch (err) {
    console.error("🔴 Failed to load profile:", err);
    res.status(500).json({ message: "Error loading profile" });
  }
};

export const resetScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.scores = []; 
    await user.save();

    res.status(200).json({ message: "Scores reset successfully" });
  } catch (err) {
    console.error("🔴 Failed to reset scores:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateScore = async (req, res) => {
  const userId = req.user.id;
  const { score, date } = req.body;

  if (score == null || !date) {
    return res.status(400).json({ message: "Score and date are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.scores = user.scores || [];
    user.scores.push({ score, date });
    await user.save();

    res.status(200).json({ message: "Score updated" });
  } catch (err) {
    console.error("🔴 Failed to update score:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
