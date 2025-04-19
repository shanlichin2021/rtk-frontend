import axios from 'axios';
import { getIdToken } from './auth/token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async config => {
  const token = await getIdToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
