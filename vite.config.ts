import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'icons': ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/free-brands-svg-icons'],
          'supabase': ['@supabase/supabase-js'],
          'map': ['leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
  },
});
