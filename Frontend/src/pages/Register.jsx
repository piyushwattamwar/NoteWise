import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://notewise-6hs6.onrender.com/api/auth/register",
        formData
      );

      toast.success("🎉 Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-100 dark:bg-gray-800 transition">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-600 dark:text-yellow-400">
          Create Your <span className="text-yellow-500">NoteWise</span> Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex items-center bg-white dark:bg-gray-700 rounded px-3 py-2 border focus-within:ring-2 focus-within:ring-green-400">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="bg-transparent flex-1 outline-none text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white dark:bg-gray-700 rounded px-3 py-2 border focus-within:ring-2 focus-within:ring-green-400">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-transparent flex-1 outline-none text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center bg-white dark:bg-gray-700 rounded px-3 py-2 border focus-within:ring-2 focus-within:ring-green-400">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-transparent flex-1 outline-none text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "⏳ Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
