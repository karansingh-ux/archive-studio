import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { archiveBackendPlugin } from './src/server/apiPlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    archiveBackendPlugin(),
  ],
  server: {
    port: 5173,
    host: '127.0.0.1',
  }
})
