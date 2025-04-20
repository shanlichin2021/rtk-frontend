// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // tell Vite that in production all assets are served from /rtk-frontend/
  base: "/rtk-frontend/",
  plugins: [react(), tailwindcss()], 
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
