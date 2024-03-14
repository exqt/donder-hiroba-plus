import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

const debug = process.env.NODE_ENV !== 'production'

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

/*
(!) Some chunks are larger than 500 kB after minification. Consider:der:
- Using dynamic import() to code-split the application          g: https://rollupjs.org/con
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunrningLimit.ks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
*/
