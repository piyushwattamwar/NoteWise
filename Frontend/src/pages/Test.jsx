import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const Test = () => {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => toast.error("Failed to load notes"));
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const generateTest = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one note to generate test");
      return;
    }

    const selectedNotes = notes.filter((n) => selected.includes(n._id));
    const combined = selectedNotes.map((n) => n.content).join("\n");

    try {
      setLoading(true);
      const res = await API.post("/ai/generate-mcq", { content: combined });
      const formattedQuestions = res.data.questions.map((q) => ({
        ...q,
        selected: null,
      }));
      setQuestions(formattedQuestions);
      setScore(null);
    } catch {
      toast.error("❌ Failed to generate test");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.correct)?.option;
      if (q.selected === correctOption) correctCount++;
    });

    setScore(correctCount);

    API.post("/users/update-score", {
      score: (correctCount / questions.length) * 100,
      date: new Date(),
    });
  };

  const allAnswered = questions.every((q) => q.selected !== null);

  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        🧠 Take a Test
      </h2>

      {!questions.length ? (
        <>
          <div className="mb-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 border p-3 rounded-xl shadow hover:shadow-md transition"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(note._id)}
                    onChange={() => toggleSelect(note._id)}
                    className="h-4 w-4"
                  />
                  <span>{note.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={generateTest}
              disabled={loading}
              className={`px-6 py-2 rounded shadow ${
                loading
                  ? "bg-gray-400 text-white cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "⏳ Generating Test..." : "🎯 Generate Test"}
            </button>

            <button
              onClick={() => navigate("/pastes")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
            >
              🔙 Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const correctOption = q.options.find((opt) => opt.correct)?.option;

              return (
                <div
                  key={idx}
                  className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow"
                >
                  <p className="font-semibold mb-2">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = opt.option === correctOption;
                      const isSelected = opt.option === q.selected;

                      const baseClasses =
                        "px-3 py-2 rounded transition block w-full text-left";

                      const bgClass =
                        score !== null
                          ? isCorrect
                            ? "bg-green-100 text-green-800 border border-green-400"
                            : isSelected
                            ? "bg-red-100 text-red-800 border border-red-400"
                            : "bg-gray-100"
                          : "bg-gray-100";

                      return (
                        <label
                          key={oIdx}
                          className={`${baseClasses} ${bgClass}`}
                        >
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            value={opt.option}
                            disabled={score !== null}
                            checked={q.selected === opt.option}
                            onChange={() => {
                              const updated = [...questions];
                              updated[idx].selected = opt.option;
                              setQuestions(updated);
                            }}
                            className="mr-2"
                          />
                          {opt.option}{" "}
                          {score !== null &&
                            (isCorrect ? "✔️" : isSelected ? "❌" : "")}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || score !== null}
              className={`px-6 py-2 rounded shadow ${
                allAnswered && score === null
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              ✅ Submit Test
            </button>
          </div>

          {score !== null && (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-green-700">
                ✅ Your Score: {score}/{questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </p>
              <button
                onClick={() => navigate("/pastes")}
                className="mt-4 px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                🔙 Go Back to Notes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Test;

