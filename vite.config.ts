// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
    react(),
    ssr({
      prerender: true
    }),
  ],
  resolve: {
    alias: {
      '~': '/src',
      // Remover @ para evitar warning do vite-plugin-ssr
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge']
          // Remover recharts do chunking para evitar problemas SSR
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    // Excluir recharts dos optimizeDeps para SSR
    exclude: ['recharts']
  },
  ssr: {
    // Forçar recharts e suas dependências a serem externas no SSR
    noExternal: [],
    external: ['recharts', 'victory-vendor', 'd3-shape', 'd3-scale', 'd3-array']
  }
})