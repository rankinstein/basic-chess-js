import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/chess/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  publicDir: '../public',
})
