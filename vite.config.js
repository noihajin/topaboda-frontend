import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9990/topaboda',
        changeOrigin: true,
        timeout: 3000,
        proxyTimeout: 3000,
      },
      '/img': {
        target: 'http://localhost:9990/topaboda',
        changeOrigin: true,
        timeout: 3000,
        proxyTimeout: 3000,
      },
    },
  },
})
