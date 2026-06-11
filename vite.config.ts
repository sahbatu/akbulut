import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { seoFilesPlugin } from './vite-plugin-seo-files'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const supabaseRemote =
  process.env.VITE_SUPABASE_URL || 'https://akbulut.gozcucloud.com'

export default defineConfig({
  plugins: [seoFilesPlugin(rootDir), react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20_000,
          groups: [
            { name: 'vendor-react', test: /node_modules\/(react|react-dom|react-router|scheduler)/ },
            { name: 'vendor-motion', test: /node_modules\/(framer-motion|motion-dom)/ },
            { name: 'vendor-supabase', test: /node_modules\/@supabase/ },
            { name: 'vendor-dnd', test: /node_modules\/@dnd-kit/ },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: supabaseProxy(),
  },
  preview: {
    proxy: supabaseProxy(),
  },
})

function supabaseProxy() {
  return {
    // CORS sorununu aşmak için Supabase isteklerini aynı origin üzerinden proxy'le
    '/supabase': {
      target: supabaseRemote,
      changeOrigin: true,
      secure: true,
      rewrite: (p: string) => p.replace(/^\/supabase/, ''),
    },
  }
}
