var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "donder-hiroba-plus",
      private: true,
      version: "0.2.0",
      type: "module",
      scripts: {
        dev: "vite dev",
        build: "vite build",
        preview: "vite preview",
        check: "svelte-check --tsconfig ./tsconfig.json",
        storybook: "storybook dev -p 6006",
        "build-storybook": "storybook build",
        version: `node -p "require('./package.json').version"`
      },
      devDependencies: {
        "@crxjs/vite-plugin": "^2.0.0-beta.21",
        "@storybook/addon-essentials": "^7.6.5",
        "@storybook/addon-interactions": "^7.6.5",
        "@storybook/addon-links": "^7.6.5",
        "@storybook/blocks": "^7.6.5",
        "@storybook/svelte": "^7.6.5",
        "@storybook/svelte-vite": "^7.6.5",
        "@storybook/test": "^7.6.5",
        "@sveltejs/vite-plugin-svelte": "^3.0.0",
        "@tsconfig/svelte": "^5.0.2",
        "@types/chrome": "^0.0.253",
        "@typescript-eslint/eslint-plugin": "^6.20.0",
        "csv-parser": "^3.0.0",
        eslint: "^8.56.0",
        "eslint-config-standard-with-typescript": "^43.0.1",
        "eslint-plugin-import": "^2.29.1",
        "eslint-plugin-n": "^16.6.2",
        "eslint-plugin-promise": "^6.1.1",
        "eslint-plugin-svelte": "^2.35.1",
        "rollup-plugin-copy": "^3.5.0",
        storybook: "^7.6.5",
        svelte: "^4.2.9",
        "svelte-check": "^3.6.0",
        "svelte-dnd-action": "^0.9.42",
        tslib: "^2.6.2",
        typescript: "^5.3.3",
        vite: "^5.0.0"
      },
      dependencies: {
        "hangul-js": "^0.2.6",
        "svelte-lazy": "^1.2.7",
        "svelte-spa-router": "^4.0.1"
      }
    };
  }
});

// vite.config.js
import { defineConfig } from "file:///C:/Users/galac/Documents/code/developing/hiroba%20extension/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///C:/Users/galac/Documents/code/developing/hiroba%20extension/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import { crx } from "file:///C:/Users/galac/Documents/code/developing/hiroba%20extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Donder Hiroba Plus",
  version: "0.0.0",
  icons: {
    "16": "src/assets/logo/icon16.png",
    "32": "src/assets/logo/icon32.png",
    "48": "src/assets/logo/icon48.png",
    "128": "src/assets/logo/icon128.png"
  },
  action: {
    default_popup: "src/popup.html",
    default_icon: {
      "16": "src/assets/logo/icon16.png",
      "32": "src/assets/logo/icon32.png",
      "48": "src/assets/logo/icon48.png",
      "128": "src/assets/logo/icon128.png"
    }
  },
  content_scripts: [
    {
      js: ["src/injection.ts"],
      matches: ["https://donderhiroba.jp/*", "http://taikowiki.com/*"],
      run_at: "document_end"
    }
  ],
  host_permissions: ["https://donderhiroba.jp/*", "http://taikowiki.com/*"],
  permissions: ["storage"]
};

// vite.config.js
var debug = process.env.NODE_ENV !== "production";
var { version } = require_package();
manifest_default.version = version;
var vite_config_default = defineConfig({
  plugins: [
    svelte({}),
    crx({ manifest: manifest_default })
  ],
  server: {
    port: 5173,
    hmr: {
      port: 5174
    }
  },
  assetsInclude: [
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg"
  ],
  build: {
    assetsInlineLimit: 0
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLmpzIiwgIm1hbmlmZXN0Lmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbIntcclxuICBcIm5hbWVcIjogXCJkb25kZXItaGlyb2JhLXBsdXNcIixcclxuICBcInByaXZhdGVcIjogdHJ1ZSxcclxuICBcInZlcnNpb25cIjogXCIwLjIuMFwiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGUgZGV2XCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxyXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImNoZWNrXCI6IFwic3ZlbHRlLWNoZWNrIC0tdHNjb25maWcgLi90c2NvbmZpZy5qc29uXCIsXHJcbiAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNlwiLFxyXG4gICAgXCJidWlsZC1zdG9yeWJvb2tcIjogXCJzdG9yeWJvb2sgYnVpbGRcIixcclxuICAgIFwidmVyc2lvblwiOiBcIm5vZGUgLXAgXFxcInJlcXVpcmUoJy4vcGFja2FnZS5qc29uJykudmVyc2lvblxcXCJcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCJeMi4wLjAtYmV0YS4yMVwiLFxyXG4gICAgXCJAc3Rvcnlib29rL2FkZG9uLWVzc2VudGlhbHNcIjogXCJeNy42LjVcIixcclxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1pbnRlcmFjdGlvbnNcIjogXCJeNy42LjVcIixcclxuICAgIFwiQHN0b3J5Ym9vay9hZGRvbi1saW5rc1wiOiBcIl43LjYuNVwiLFxyXG4gICAgXCJAc3Rvcnlib29rL2Jsb2Nrc1wiOiBcIl43LjYuNVwiLFxyXG4gICAgXCJAc3Rvcnlib29rL3N2ZWx0ZVwiOiBcIl43LjYuNVwiLFxyXG4gICAgXCJAc3Rvcnlib29rL3N2ZWx0ZS12aXRlXCI6IFwiXjcuNi41XCIsXHJcbiAgICBcIkBzdG9yeWJvb2svdGVzdFwiOiBcIl43LjYuNVwiLFxyXG4gICAgXCJAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlXCI6IFwiXjMuMC4wXCIsXHJcbiAgICBcIkB0c2NvbmZpZy9zdmVsdGVcIjogXCJeNS4wLjJcIixcclxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcIl4wLjAuMjUzXCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjYuMjAuMFwiLFxyXG4gICAgXCJjc3YtcGFyc2VyXCI6IFwiXjMuMC4wXCIsXHJcbiAgICBcImVzbGludFwiOiBcIl44LjU2LjBcIixcclxuICAgIFwiZXNsaW50LWNvbmZpZy1zdGFuZGFyZC13aXRoLXR5cGVzY3JpcHRcIjogXCJeNDMuMC4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjkuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLW5cIjogXCJeMTYuNi4yXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tcHJvbWlzZVwiOiBcIl42LjEuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXN2ZWx0ZVwiOiBcIl4yLjM1LjFcIixcclxuICAgIFwicm9sbHVwLXBsdWdpbi1jb3B5XCI6IFwiXjMuNS4wXCIsXHJcbiAgICBcInN0b3J5Ym9va1wiOiBcIl43LjYuNVwiLFxyXG4gICAgXCJzdmVsdGVcIjogXCJeNC4yLjlcIixcclxuICAgIFwic3ZlbHRlLWNoZWNrXCI6IFwiXjMuNi4wXCIsXHJcbiAgICBcInN2ZWx0ZS1kbmQtYWN0aW9uXCI6IFwiXjAuOS40MlwiLFxyXG4gICAgXCJ0c2xpYlwiOiBcIl4yLjYuMlwiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMy4zXCIsXHJcbiAgICBcInZpdGVcIjogXCJeNS4wLjBcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJoYW5ndWwtanNcIjogXCJeMC4yLjZcIixcclxuICAgIFwic3ZlbHRlLWxhenlcIjogXCJeMS4yLjdcIixcclxuICAgIFwic3ZlbHRlLXNwYS1yb3V0ZXJcIjogXCJeNC4wLjFcIlxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGdhbGFjXFxcXERvY3VtZW50c1xcXFxjb2RlXFxcXGRldmVsb3BpbmdcXFxcaGlyb2JhIGV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ2FsYWNcXFxcRG9jdW1lbnRzXFxcXGNvZGVcXFxcZGV2ZWxvcGluZ1xcXFxoaXJvYmEgZXh0ZW5zaW9uXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nYWxhYy9Eb2N1bWVudHMvY29kZS9kZXZlbG9waW5nL2hpcm9iYSUyMGV4dGVuc2lvbi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnXHJcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcclxuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuanNvbidcclxuXHJcbmNvbnN0IGRlYnVnID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJ1xyXG5cclxuLy8gZ2V0IHZlcnNpb24gaW4gcGFja2FnZS5qc29uXHJcbmNvbnN0IHsgdmVyc2lvbiB9ID0gcmVxdWlyZSgnLi9wYWNrYWdlLmpzb24nKVxyXG5tYW5pZmVzdC52ZXJzaW9uID0gdmVyc2lvblxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICBzdmVsdGUoe30pLFxyXG4gICAgY3J4KHsgbWFuaWZlc3QgfSksXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDUxNzMsXHJcbiAgICBobXI6IHtcclxuICAgICAgcG9ydDogNTE3NCxcclxuICAgIH0sXHJcbiAgfSxcclxuICBhc3NldHNJbmNsdWRlOiBbXHJcbiAgICAnKiovKi5wbmcnLFxyXG4gICAgJyoqLyouanBnJyxcclxuICAgICcqKi8qLmpwZWcnLFxyXG4gICAgJyoqLyouZ2lmJyxcclxuICAgICcqKi8qLnN2ZycsXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXHJcbiAgfVxyXG59KVxyXG4iLCAie1xyXG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxyXG4gIFwibmFtZVwiOiBcIkRvbmRlciBIaXJvYmEgUGx1c1wiLFxyXG4gIFwidmVyc2lvblwiOiBcIjAuMC4wXCIsXHJcbiAgXCJpY29uc1wiOiB7XHJcbiAgICBcIjE2XCI6ICBcInNyYy9hc3NldHMvbG9nby9pY29uMTYucG5nXCIsXHJcbiAgICBcIjMyXCI6ICBcInNyYy9hc3NldHMvbG9nby9pY29uMzIucG5nXCIsXHJcbiAgICBcIjQ4XCI6ICBcInNyYy9hc3NldHMvbG9nby9pY29uNDgucG5nXCIsXHJcbiAgICBcIjEyOFwiOiBcInNyYy9hc3NldHMvbG9nby9pY29uMTI4LnBuZ1wiXHJcbiAgfSxcclxuICBcImFjdGlvblwiOiB7XHJcbiAgICBcImRlZmF1bHRfcG9wdXBcIjogXCJzcmMvcG9wdXAuaHRtbFwiLFxyXG4gICAgXCJkZWZhdWx0X2ljb25cIjoge1xyXG4gICAgICBcIjE2XCI6ICBcInNyYy9hc3NldHMvbG9nby9pY29uMTYucG5nXCIsXHJcbiAgICAgIFwiMzJcIjogIFwic3JjL2Fzc2V0cy9sb2dvL2ljb24zMi5wbmdcIixcclxuICAgICAgXCI0OFwiOiAgXCJzcmMvYXNzZXRzL2xvZ28vaWNvbjQ4LnBuZ1wiLFxyXG4gICAgICBcIjEyOFwiOiBcInNyYy9hc3NldHMvbG9nby9pY29uMTI4LnBuZ1wiXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXHJcbiAgICB7XHJcbiAgICAgIFwianNcIjogW1wic3JjL2luamVjdGlvbi50c1wiXSxcclxuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHBzOi8vZG9uZGVyaGlyb2JhLmpwLypcIiwgXCJodHRwOi8vdGFpa293aWtpLmNvbS8qXCJdLFxyXG4gICAgICBcInJ1bl9hdFwiOiBcImRvY3VtZW50X2VuZFwiXHJcbiAgICB9XHJcbiAgXSxcclxuICBcImhvc3RfcGVybWlzc2lvbnNcIjogW1wiaHR0cHM6Ly9kb25kZXJoaXJvYmEuanAvKlwiLCBcImh0dHA6Ly90YWlrb3dpa2kuY29tLypcIl0sXHJcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJzdG9yYWdlXCJdXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDRSxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsTUFDWCxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsUUFDVCxLQUFPO0FBQUEsUUFDUCxPQUFTO0FBQUEsUUFDVCxTQUFXO0FBQUEsUUFDWCxPQUFTO0FBQUEsUUFDVCxXQUFhO0FBQUEsUUFDYixtQkFBbUI7QUFBQSxRQUNuQixTQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsaUJBQW1CO0FBQUEsUUFDakIsc0JBQXNCO0FBQUEsUUFDdEIsK0JBQStCO0FBQUEsUUFDL0IsaUNBQWlDO0FBQUEsUUFDakMsMEJBQTBCO0FBQUEsUUFDMUIscUJBQXFCO0FBQUEsUUFDckIscUJBQXFCO0FBQUEsUUFDckIsMEJBQTBCO0FBQUEsUUFDMUIsbUJBQW1CO0FBQUEsUUFDbkIsZ0NBQWdDO0FBQUEsUUFDaEMsb0JBQW9CO0FBQUEsUUFDcEIsaUJBQWlCO0FBQUEsUUFDakIsb0NBQW9DO0FBQUEsUUFDcEMsY0FBYztBQUFBLFFBQ2QsUUFBVTtBQUFBLFFBQ1YsMENBQTBDO0FBQUEsUUFDMUMsd0JBQXdCO0FBQUEsUUFDeEIsbUJBQW1CO0FBQUEsUUFDbkIseUJBQXlCO0FBQUEsUUFDekIsd0JBQXdCO0FBQUEsUUFDeEIsc0JBQXNCO0FBQUEsUUFDdEIsV0FBYTtBQUFBLFFBQ2IsUUFBVTtBQUFBLFFBQ1YsZ0JBQWdCO0FBQUEsUUFDaEIscUJBQXFCO0FBQUEsUUFDckIsT0FBUztBQUFBLFFBQ1QsWUFBYztBQUFBLFFBQ2QsTUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLGNBQWdCO0FBQUEsUUFDZCxhQUFhO0FBQUEsUUFDYixlQUFlO0FBQUEsUUFDZixxQkFBcUI7QUFBQSxNQUN2QjtBQUFBLElBQ0Y7QUFBQTtBQUFBOzs7QUNoRDZXLFNBQVMsb0JBQW9CO0FBQzFZLFNBQVMsY0FBYztBQUN2QixTQUFTLFdBQVc7OztBQ0ZwQjtBQUFBLEVBQ0Usa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsT0FBUztBQUFBLElBQ1AsTUFBTztBQUFBLElBQ1AsTUFBTztBQUFBLElBQ1AsTUFBTztBQUFBLElBQ1AsT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVU7QUFBQSxJQUNSLGVBQWlCO0FBQUEsSUFDakIsY0FBZ0I7QUFBQSxNQUNkLE1BQU87QUFBQSxNQUNQLE1BQU87QUFBQSxNQUNQLE1BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakI7QUFBQSxNQUNFLElBQU0sQ0FBQyxrQkFBa0I7QUFBQSxNQUN6QixTQUFXLENBQUMsNkJBQTZCLHdCQUF3QjtBQUFBLE1BQ2pFLFFBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0Esa0JBQW9CLENBQUMsNkJBQTZCLHdCQUF3QjtBQUFBLEVBQzFFLGFBQWUsQ0FBQyxTQUFTO0FBQzNCOzs7QUR2QkEsSUFBTSxRQUFRLFFBQVEsSUFBSSxhQUFhO0FBR3ZDLElBQU0sRUFBRSxRQUFRLElBQUk7QUFDcEIsaUJBQVMsVUFBVTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPLENBQUMsQ0FBQztBQUFBLElBQ1QsSUFBSSxFQUFFLDJCQUFTLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxtQkFBbUI7QUFBQSxFQUNyQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
