import axios from "axios";
import { getIdToken } from "./auth/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
});

// Intercept all requests to inject the Google ID token
api.interceptors.request.use((config) => {
  const token = getIdToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
