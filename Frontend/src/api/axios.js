import axios from "axios";

const API = axios.create({
  baseURL: "https://notewise-6hs6.onrender.com",
});

// Automatically attach token to each request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authToken = token;
  }
  return req;
});

export default API;

