import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 프록시 서버
    proxy: {
      '/yahoo': {
        target: 'https://query2.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yahoo/, '')
      },
      '/graphql': {
        target: 'http://localhost:5000',  // 8080에서 5000으로 수정
        changeOrigin: true,
        secure: false,
      }
    }
  }
}) 