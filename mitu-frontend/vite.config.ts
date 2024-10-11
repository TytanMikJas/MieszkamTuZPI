import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // @ts-ignore
      plugins: [fixReactVirtualized],
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:3000/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      "/uploads": {
        target: "https://localhost:3000/uploads",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, "")
      }
    },
    host: true,
    cors: {
      origin: '*',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
