import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base is set correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000
  }
})
