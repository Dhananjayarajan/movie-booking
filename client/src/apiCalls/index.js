import axios from "axios";

// Create an axios instance
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Update to match backend port
});

// ✅ Add interceptor to attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
