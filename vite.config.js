import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path';
import { existsSync, unlinkSync, renameSync } from 'fs';

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
    rollupOptions: {
      input: {
        rating: resolve(import.meta.dirname, 'public', 'rating.html')
      },
      plugins: [{
        name: 'rename rating.html',
        closeBundle() {
          const path1 = resolve(import.meta.dirname, 'dist', 'rating.html');
          const path2 = resolve(import.meta.dirname, 'dist', 'public', 'rating.html')
          if (existsSync(path1) && existsSync(path2)) {
            unlinkSync(path1);
            renameSync(path2, path1);
          }
        }
      }]
    }
  }
})
