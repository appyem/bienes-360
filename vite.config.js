import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.svg', 'logo.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Aumentamos el límite de caché de 2MB a 5MB (5,000,000 bytes)
        maximumFileSizeToCacheInBytes: 5000000 
      }
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  build: {
    // Aumentamos el límite de advertencia de chunks a 3MB (3000 KB)
    chunkSizeWarningLimit: 3000 
  }
})