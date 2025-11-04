import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // La URL donde está tu backend
        changeOrigin: true, // Debe estar en true
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});
