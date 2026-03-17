import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소에 맞게 수정하세요
        changeOrigin: true,
      },
      '/img': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})