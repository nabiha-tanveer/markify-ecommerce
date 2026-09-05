import axios from "axios";

const api = axios.create({
baseURL: "https://markify-ecommerce-production-3b54.up.railway.app/api",
});

// Automatically attach token to every request if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;