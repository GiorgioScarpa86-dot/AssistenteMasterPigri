import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base path: '/' in dev/preview, '/AssistenteMasterPigri/' when the
// GitHub Pages workflow builds with VITE_BASE set.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Master Pigri - DM Assistant',
        short_name: 'MasterPigri',
        start_url: base,
        scope: base,
        description: 'Real-time session assistant for D&D 5e Dungeon Masters',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443
    },
    cors: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    // @ts-ignore - allow all hosts for preview
    allowedHosts: true as any
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
})
