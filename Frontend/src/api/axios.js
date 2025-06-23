import axios from "axios";

const API = axios.create({
  baseURL: "https://notewise-6hs6.onrender.com/api", 
  headers: { Authorization: `Bearer ${token}` } 
});

export default API;
