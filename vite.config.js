import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true,
    proxy: {
      "/api/v1/K8sGenie": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true
      },
      "/api/v1/UserCenter": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true
      }
    }
  }
})
