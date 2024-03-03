import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import VueRouter from 'unplugin-vue-router/vite'
import { notBundle } from 'vite-plugin-electron/plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    VueRouter({ routesFolder: 'src/pages' }),
    vue(),
    AutoImport({
      imports: [
        'vue',
        { imports: ['useRoute', 'useRouter'], from: 'vue-router/auto-routes' },
        '@vueuse/core',
      ],
    }),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        vite: {
          plugins: [command === 'serve' && notBundle()],
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
  ],
}))
