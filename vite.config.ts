import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

const root = resolve(__dirname, 'src/render')
const outDir = resolve(__dirname, 'dist/render')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  base: './',
  build: {
    outDir,
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
    ],
  },
  plugins: [vue(), vueJsx()],
})
