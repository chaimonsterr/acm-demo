import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In local dev, forward catalogue requests and site images to the live site
// (same as the rewrites in vercel.json).
const LIVE = 'https://aircraftcitymodel.com'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: LIVE, changeOrigin: true },
      '/live': { target: LIVE, changeOrigin: true, rewrite: (p) => p.replace(/^\/live/, '') },
    },
  },
})
