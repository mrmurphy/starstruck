import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

const iconSizes = [512, 256, 192, 180, 152, 128, 96, 72, 64, 48, 32, 16]

const icons = iconSizes.map((size) => ({
  src: `/icons/icon-${size}.png`,
  sizes: `${size}x${size}`,
  type: 'image/png',
  purpose: 'any maskable',
}))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-64.png', 'icons/icon-128.png', 'icons/icon-256.png', 'offline.html'],
      manifest: {
        name: 'Starstruck',
        short_name: 'Starstruck',
        description: 'A beautiful, simple, powerful astrology PWA for local-first birth charts.',
        theme_color: '#05040d',
        background_color: '#05040d',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['lifestyle', 'productivity'],
        icons,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: '/offline.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
