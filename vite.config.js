import react from '@vitejs/plugin-react'
import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg: { quality: 72 },
      jpeg: { quality: 72 },
      png: { quality: 72 },
      webp: { quality: 78 },
    }),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        cpSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
  base: '/galaxy-english-school/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (
            id.includes('react-router')
            || id.includes('react-dom')
            || id.includes('/react/')
          ) {
            return 'react-vendor'
          }
          return undefined
        },
      },
    },
  },
})
