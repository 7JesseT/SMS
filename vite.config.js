import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ===== OPTIMIZATION: Pre-bundle heavy dependencies =====
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'framer-motion',
      'react-icons/fi',
      'react-chartjs-2',
      'chart.js',
    ],
  },

  // ===== BUILD OPTIMIZATION: Smart chunk splitting =====
  build: {
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 1000,
    
    // Manual chunks for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: Core React + Redux + Router
          'vendor-core': [
            'react',
            'react-dom',
            'react-router-dom',
            '@reduxjs/toolkit',
            'react-redux',
          ],
          
          // Data fetching chunk
          'vendor-query': [
            '@tanstack/react-query',
            '@tanstack/react-table',
          ],
          
          // Charting/Visualization chunk
          'vendor-charts': [
            'chart.js',
            'react-chartjs-2',
          ],
          
          // UI/Animation chunk
          'vendor-ui': [
            'framer-motion',
            'react-icons',
            'react-toastify',
          ],
          
          // PDF/Forms chunk (lazy-loaded only when needed)
          'vendor-pdf': [
            '@react-pdf/renderer',
            'react-hook-form',
            '@hookform/resolvers',
            'yup',
          ],
        },
      },
    },
  },
})
