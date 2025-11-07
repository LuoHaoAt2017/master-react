import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "react": "file:./lib/react-18.2.0/build/node_modules/react",
      // "react-dom": "file:./lib/react-18.2.0/build/node_modules/react-dom"
      "react": path.resolve(__dirname, "lib/react-18.2.0/build/node_modules/react"),
      "react-dom": path.resolve(__dirname, "lib/react-18.2.0/build/node_modules/react-dom"),
    },
  },
  server: {
    port: 3000,
  },
});
