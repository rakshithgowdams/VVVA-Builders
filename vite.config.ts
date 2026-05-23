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
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/@fortawesome')) {
            return 'icons';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'map';
          }
          if (id.includes('/pages/admin/') || id.includes('/components/ProjectsManager') || id.includes('/components/AdminProfile')) {
            return 'admin';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 4096,
  },
});
