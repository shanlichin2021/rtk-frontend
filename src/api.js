// src/api.js
import axios from "axios";
import { getIdToken } from "./auth/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,  // e.g. https://rtk-gateway-xxx.uc.gateway.dev
});

// Intercept every request to inject Authorization header
api.interceptors.request.use((config) => {
  const token = getIdToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
