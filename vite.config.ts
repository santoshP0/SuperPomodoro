import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
    // Auto-detects src/main/index.ts
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
    // Auto-detects src/preload/index.ts
  },
  renderer: {
    // Auto-detects src/renderer/index.html
    plugins: [react()]
  }
})
