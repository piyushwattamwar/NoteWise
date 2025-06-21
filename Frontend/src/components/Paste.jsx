import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

import {
  FaEdit,
  FaTrash,
  FaCopy,
  FaShareAlt,
  FaSearch,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

const Paste = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [summarizingNoteId, setSummarizingNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes", {
        headers: { authToken: localStorage.getItem("token") },
      });
      const data = res.data;
      console.log("✅ Notes Response:", data);
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("❌ Invalid data from server:", data);
        toast.error("Unexpected response from server");
        setNotes([]);
      }
    } catch (err) {
      console.error("❌ Error loading notes:", err);
      toast.error("Failed to load notes");
      setNotes([]);
    }
  };

  const handleDownloadNote = (note) => {
    const blob = new Blob(
      [
        `Title: ${note.title}\nCategory: ${
          note.category || "Uncategorized"
        }\n\n${note.content}`,
      ],
      { type: "text/plain;charset=utf-8" }
    );

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title || "note"}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handlePinToggle = async (note) => {
    try {
      await API.put(`/notes/${note._id}`, {
        ...note,
        pinned: !note.pinned,
      });
      toast.success(note.pinned ? "Note unpinned" : "Note pinned");
      fetchNotes();
    } catch {
      toast.error("Pin action failed");
    }
  };

  const handleSummarize = async (note) => {
    setSummarizingNoteId(note._id);
    try {
      const res = await API.post("/ai/summarize", { content: note.content });
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, summary: res.data.summary } : n
        )
      );
      toast.success("📝 Summary generated!");
    } catch {
      toast.error("Failed to summarize note");
    } finally {
      setSummarizingNoteId(null);
    }
  };

  const filteredData = Array.isArray(notes)
    ? notes
        .filter(
          (note) =>
            note.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter === "All" || note.category === categoryFilter)
        )
        .sort((a, b) => b.pinned - a.pinned)
    : [];

  const uniqueCategories = [
    "All",
    ...new Set(
      (Array.isArray(notes) ? notes : []).map(
        (n) => n.category || "Uncategorized"
      )
    ),
  ];

  return (
    <div className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      {/* 🔍 Search + 📂 Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="flex items-center gap-3">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            className="p-2 rounded-xl min-w-[300px] border border-gray-400"
            type="search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded-xl border border-gray-400 bg-white dark:bg-gray-800"
        >
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              📂 {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📝 Notes */}
      <div className="flex flex-col gap-5 mt-6">
        {filteredData.length > 0 ? (
          filteredData.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border p-4 rounded-xl shadow bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-blue-800">
                  {note.title}
                </h2>
                <button
                  onClick={() => handlePinToggle(note)}
                  className="text-yellow-500 text-xl hover:scale-110 transition"
                  title={note.pinned ? "Unpin Note" : "Pin Note"}
                >
                  {note.pinned ? <FaStar /> : <FaRegStar />}
                </button>
              </div>

              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm text-gray-800 overflow-hidden line-clamp-3 text-ellipsis">
                {note.content.length > 200
                  ? `${note.content.slice(0, 200)}...`
                  : note.content}
              </pre>

              <div className="text-sm text-gray-500 mt-2">
                📂 Category: {note.category || "Uncategorized"}
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <Link to={`/edit/${note._id}`}>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">
                    <FaEdit /> Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  <FaTrash /> Delete
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(note.content);
                    toast.success("📋 Copied to clipboard");
                  }}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                >
                  <FaCopy /> Copy
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/pastes/${note._id}`;
                    navigator.clipboard.writeText(url);
                    toast.success("🔗 Link copied");
                  }}
                  className="flex items-center gap-2 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600 transition"
                >
                  <FaShareAlt /> Share
                </button>
                {!note.summary ? (
                  <button
                    onClick={() => handleSummarize(note)}
                    className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                    disabled={summarizingNoteId === note._id}
                  >
                    {summarizingNoteId === note._id
                      ? "Summarizing..."
                      : "🔍 Summarize"}
                  </button>
                ) : (
                  <p className="text-sm mt-2 bg-indigo-100 text-indigo-800 p-2 rounded">
                    📌 Summary: {note.summary}
                  </p>
                )}
              </div>

              {/* Download button at bottom right */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDownloadNote(note)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                >
                  ⬇️ Download
                </button>
              </div>

              <div className="text-sm text-gray-500 mt-2">
                🕒 Created At: {new Date(note.createdAt).toLocaleString()}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No Notes found.</p>
        )}
      </div>
    </div>
  );
};

export default Paste;

