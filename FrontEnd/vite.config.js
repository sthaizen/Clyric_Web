import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lucide-react') || id.includes('@tabler')) return 'ui';
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('@monaco-editor')) return 'monaco';
            if (id.includes('@clerk')) return 'clerk';
            return 'vendor-other';
          }
        }
      }
    }
  }
})
