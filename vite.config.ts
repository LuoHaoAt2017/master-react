import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "react": path.resolve(__dirname, "lib/react-18.2.0/packages/react"),
      // "react-art": path.resolve(__dirname, "lib/react-18.2.0/packages/react-art"),
      // "react-cache": path.resolve(__dirname, "lib/react-18.2.0/packages/react-cache"),
      // "react-client": path.resolve(__dirname, "lib/react-18.2.0/packages/react-client"),
      // "react-debug-tools": path.resolve(__dirname, "lib/react-18.2.0/packages/react-debug-tools"),
      // "react-devtools": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools"),
      // "react-devtools-core": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-core"),
      // "react-devtools-extensions": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-extensions"),
      // "react-devtools-inline": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-inline"),
      // "react-devtools-shared": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-shared"),
      // "react-devtools-shell": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-shell"),
      // "react-devtools-timeline": path.resolve(__dirname, "lib/react-18.2.0/packages/react-devtools-timeline"),
      // "react-dom": path.resolve(__dirname, "lib/react-18.2.0/packages/react-dom"),
      // "react-fetch": path.resolve(__dirname, "lib/react-18.2.0/packages/react-fetch"),
      // "react-fs": path.resolve(__dirname, "lib/react-18.2.0/packages/react-fs"),
      // "react-interactions": path.resolve(__dirname, "lib/react-18.2.0/packages/react-interactions"),
      // "react-is": path.resolve(__dirname, "lib/react-18.2.0/packages/react-is"),
      // "react-native-renderer": path.resolve(__dirname, "lib/react-18.2.0/packages/react-native-renderer"),
      // "react-noop-renderer": path.resolve(__dirname, "lib/react-18.2.0/packages/react-noop-renderer"),
      // "react-pg": path.resolve(__dirname, "lib/react-18.2.0/packages/react-pg"),
      // "react-reconciler": path.resolve(__dirname, "lib/react-18.2.0/packages/react-reconciler"),
      // "react-refresh": path.resolve(__dirname, "lib/react-18.2.0/packages/react-refresh"),
      // "react-server": path.resolve(__dirname, "lib/react-18.2.0/packages/react-server"),
      // "react-server-dom-relay": path.resolve(__dirname, "lib/react-18.2.0/packages/react-server-dom-relay"),
      // "react-server-dom-webpack": path.resolve(__dirname, "lib/react-18.2.0/packages/react-server-dom-webpack"),
      // "react-server-native-relay": path.resolve(__dirname, "lib/react-18.2.0/packages/react-server-native-relay"),
      // "react-suspense-test-utils": path.resolve(__dirname, "lib/react-18.2.0/packages/react-suspense-test-utils"),
      // "react-test-renderer": path.resolve(__dirname, "lib/react-18.2.0/packages/react-test-renderer"),
      // "scheduler": path.resolve(__dirname, "lib/react-18.2.0/packages/scheduler"),
      // "shared": path.resolve(__dirname, "lib/react-18.2.0/packages/shared"),
      // "use-subscription": path.resolve(__dirname, "lib/react-18.2.0/packages/use-subscription"),
      // "use-sync-external-store": path.resolve(__dirname, "lib/react-18.2.0/packages/use-sync-external-store"),
    },
  },
  server: {
    port: 3000,
  },
});
