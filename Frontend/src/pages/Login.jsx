import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaLock, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const res = await axios.post("https://notewise-6hs6.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/pastes");
      } else {
        toast.error("No token received from server");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800 transition">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-yellow-400">
          Login to <span className="text-yellow-500">NoteWise</span>
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex items-center bg-white dark:bg-gray-700 rounded px-3 py-2 border focus-within:ring-2 focus-within:ring-blue-400">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              value={email}
              placeholder="Email"
              className="bg-transparent flex-1 outline-none text-sm"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-white dark:bg-gray-700 rounded px-3 py-2 border focus-within:ring-2 focus-within:ring-blue-400">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-sm"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded transition text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

