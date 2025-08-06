import axios from "axios";

const api = axios.create({
  baseURL: "https://personal-tracker-backend-6v56.onrender.com/", // change to your backend URL
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
