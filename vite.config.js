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
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  // Añade este bloque para silenciar la advertencia de tamaño
  build: {
    chunkSizeWarningLimit: 2000 // Aumenta el límite a 2000 KB (2 MB)
  }
})