// src/api.js
import axios from "axios";
import { getIdToken } from "./auth/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// Async interceptor that waits for the token
api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
