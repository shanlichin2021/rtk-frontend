// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

  // (optional) you can also customize build output if you want:
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
