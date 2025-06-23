// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://notewise-6hs6.onrender.com/api", // ✅ use deployed backend URL
});

// Add auth token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;


