import React, { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Failed to load user info"));

    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => toast.error("Failed to load notes"));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  // 🧾 Notes stats
  const totalNotes = notes.length;
  const pinnedNotes = notes.filter((note) => note.pinned).length;
  const lastEdited = notes.length
    ? new Date(
        Math.max(...notes.map((n) => new Date(n.updatedAt)))
      ).toLocaleString()
    : "N/A";

  const categories = notes.reduce((acc, note) => {
    const key = note.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString();
    const count = notes.filter(
      (n) => new Date(n.createdAt).toDateString() === date.toDateString()
    ).length;
    return { date: label, count };
  }).reverse();

  // 📊 Test stats
  const testScores = user.scores || [];
  const totalTests = testScores.length;
  const averageScore =
    totalTests > 0
      ? Math.round(testScores.reduce((sum, s) => sum + s.score, 0) / totalTests)
      : 0;
  const scoreData = testScores.slice(-5).map((s, i) => ({
    name: `Test ${i + 1}`,
    score: s.score,
    date: new Date(s.date).toLocaleDateString(),
  }));

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">👤 User Profile</h2>
      <p>
        <strong>📛 Name:</strong> {user.name}
      </p>
      <p>
        <strong>📧 Email:</strong> {user.email}
      </p>
      <p>
        <strong>📅 Joined:</strong>{" "}
        {user.createdAt && !isNaN(new Date(user.createdAt))
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown"}
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          📊 Note Activity
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>📝 Notes Created: {totalNotes}</li>
          <li>⭐ Pinned Notes: {pinnedNotes}</li>
          <li>🕒 Last Note Edited: {lastEdited}</li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
          🧠 Test Performance
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🧪 Tests Taken: {totalTests}</li>
          <li>📈 Average Score: {averageScore}%</li>
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-2 text-purple-600">
            📂 Notes by Category
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2 text-teal-600">
            📆 Notes Created (Last 7 Days)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {totalTests > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-2 text-rose-600">
            🧪 Recent Test Scores
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>

          {/* ✅ Reset Test Scores Button */}
          <button
            onClick={async () => {
              try {
                await API.post("/users/reset-scores");
                toast.success("🧹 Test scores reset!");
                setUser((prev) => ({ ...prev, scores: [] }));
              } catch {
                toast.error("Failed to reset scores");
              }
            }}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            🧹 Reset Test Performance
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
