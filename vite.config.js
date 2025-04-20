import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/rtk-frontend/",
  plugins: [react(), tailwindcss()], 
  server: {
    // In dev, proxy /api → your Cloud Run or Gateway to bypass browser CORS
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
