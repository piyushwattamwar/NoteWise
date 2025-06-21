import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};
export const createNote = async (req, res) => {
    const { title, content, category } = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
  
    const note = await Note.create({
      user: req.user._id,
      title,
      content,
      category: category || "Uncategorized", 
    });
  
    res.status(201).json(note);
  };
  

export const updateNote = async (req, res) => {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: req.body.title,
        content: req.body.content,
        pinned: req.body.pinned, 
        category: req.body.category,
      },
      { new: true }
    );
  
    res.json(note);
  };
  
export const deleteNote = async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Note deleted" });
};
