import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/socket': {
        target: 'ws://localhost:8081',
        changeOrigin: true,
        ws: true
      }
    },
    origin: "http://0.0.0.0:5173",
  },
});