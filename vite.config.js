import react from '@vitejs/plugin-react'
import { cpSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        cpSync(resolve('dist/index.html'), resolve('dist/404.html'))
      },
    },
  ],
  base: '/galaxy-english-school/',
})
