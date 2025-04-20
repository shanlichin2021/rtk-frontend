import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/rtk-frontend/",
  plugins: [react(), tailwindcss()], 
  server: {
    proxy: {
      // Proxy /api to Cloud Run in development to avoid CORS locally
      "/api": {
        target: process.env.VITE_API_BASE,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
