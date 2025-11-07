import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    preserveSymlinks: true
  },
  build: {
    rollupOptions: {
      external: []
    }
  },
  server: {
    port: 3000,
    force: true,
    watch: {
      followSymlinks: true
    }
  },
})