import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: ['..'], // Permite acceso a public/ incluso si está fuera del root
    },
    strictPort: true, // Evita que Vite cambie el puerto automáticamente
  },
})