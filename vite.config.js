import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

const debug = process.env.NODE_ENV !== 'production'

// get version in package.json
const { version } = require('./package.json')
manifest.version = version

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({}),
    crx({ manifest }),
  ],
  server: {
    port: 5173,
    hmr: {
      port: 5174,
    },
  },
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
  ],
  build: {
    assetsInlineLimit: 0,
  }
})
