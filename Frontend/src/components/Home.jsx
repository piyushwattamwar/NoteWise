import React, { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // ✅ Create Note
  const createNote = async () => {
    if (!title.trim() || !value.trim()) {
      return toast.error("Title and Content are required!");
    }

    try {
      await API.post("/notes", {
        title,
        content: value,
        category: category || "Uncategorized",
      });

      toast.success("✅ Note saved successfully!");
      setTitle("");
      setValue("");
      setCategory("");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "❌ Failed to save note");
    }
  };

  // ✅ Suggest Title
  const suggestTitle = async () => {
    if (!value.trim()) return toast.error("Note content is required");

    try {
      setLoadingTitle(true);
      const res = await API.post("/ai/suggest-title", { content: value });
      setTitle(res.data.title);
      toast.success("✨ Title suggested!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to suggest title");
    } finally {
      setLoadingTitle(false);
    }
  };

  // ✅ Suggest Category
  const suggestCategory = async () => {
    if (!value.trim()) return toast.error("Note content is required");

    try {
      setLoadingCategory(true);
      const res = await API.post("/ai/suggest-category", { content: value });
      setCategory(res.data.category);
      toast.success("📂 Category suggested!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to suggest category");
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white transition">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            className="p-3 rounded-xl flex-grow w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="text"
            placeholder="📝 Enter Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={suggestTitle}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
            disabled={loadingTitle}
          >
            {loadingTitle ? "Suggesting..." : "✨ Suggest Title"}
          </button>
        </div>

        {/* Category + Suggest Category */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4">
          <input
            className="p-3 rounded-xl flex-grow w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            type="text"
            placeholder="📂 Enter Category (e.g., Work, Personal, Idea)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            onClick={suggestCategory}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
            disabled={loadingCategory}
          >
            {loadingCategory ? "Suggesting..." : "✨ Suggest Category"}
          </button>
          <button
            onClick={createNote}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            ➕ Create Note
          </button>
        </div>

        {/* Note Textarea */}
        <div className="mt-6">
          <textarea
            className="w-full h-[400px] rounded-xl p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            placeholder="📄 Enter your content here..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
