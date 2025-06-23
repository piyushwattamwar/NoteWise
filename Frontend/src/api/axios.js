import axios from "axios";

const API = axios.create({
  baseURL: "https://notewise-6hs6.onrender.com/api", 
});

export default API;
