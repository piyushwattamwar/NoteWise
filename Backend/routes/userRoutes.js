import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { updateScore } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { resetScores } from "../controllers/userController.js";

const router = express.Router();

router.get('/profile', protect, getUserProfile);

router.post("/update-score", protect, updateScore);



router.post("/score", protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.scores.push({
      score: req.body.score,
      note: req.body.noteId,
      date: new Date(),
    });
    await user.save();
    res.status(200).json({ message: "Score saved" });
  });
  
  router.post("/reset-scores", protect, resetScores);

export default router;
