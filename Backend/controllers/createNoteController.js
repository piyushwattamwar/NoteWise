export const createNote = async (req, res) => {
    const { title, content, category } = req.body;
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      category: category || "Uncategorized", 
    });
    res.status(201).json(note);
  };
  