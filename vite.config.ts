import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { ViteSSG } from 'vite-ssg'

import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  plugins: [vue(), VueDevTools({
    launchEditor: 'webstorm',
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 2000 // Adjust the limit as needed
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      preload: 'media',
    },
    dirStyle: 'nested', // Creates /about/index.html instead of /about.html
    includedRoutes: (paths) => {
      // Included routes for static generation
      // You can customize this to include only specific routes
      return [
        '/',
        '/about',
        '/terms',
        '/privacy',
        '/faq',
        ...paths.filter(path => path.startsWith('/') && !path.includes(':'))
      ]
    }
  }
  // build: {
  //   rollupOptions: {
  //     external: ['@fullcalendar/timeGrid']
  //   }
  // }
})
