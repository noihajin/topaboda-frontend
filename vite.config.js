import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9990',
        changeOrigin: true,
        rewrite: (path) => '/topaboda' + path,
        timeout: 60000,
        proxyTimeout: 60000,
      },
      '/img': {
        target: 'http://localhost:9990',
        changeOrigin: true,
        rewrite: (path) => '/topaboda' + path,
        timeout: 60000,
        proxyTimeout: 60000,
      },
    },
  },
})
