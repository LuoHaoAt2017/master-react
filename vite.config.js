import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteMockServe } from "vite-plugin-mock";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: path.resolve(__dirname, 'src/mocks'),
        enable: env.VITE_ENABLE_MOCK
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
  }
});
