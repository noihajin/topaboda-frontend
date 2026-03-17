import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9990/topaboda',
        changeOrigin: true,
      },
      '/img': {
        target: 'http://localhost:9990/topaboda',
        changeOrigin: true,
      },
    },
  },
})
