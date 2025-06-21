import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await API.get("/notes");
        const note = res.data.find((n) => n._id === id);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        } else {
          toast.error("Note not found");
          navigate("/pastes");
        }
      } catch {
        toast.error("Error fetching note");
      }
    };
    fetchNote();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      return toast.error("Title and content are required!");
    }

    try {
      await API.put(`/notes/${id}`, { title, content });
      toast.success("Note updated successfully!");
      navigate("/pastes");
    } catch {
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">✏️ Edit Note</h2>
      <input
        className="w-full p-2 border border-gray-400 rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        rows={10}
        className="w-full p-2 border border-gray-400 rounded mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditNote;
