import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DirectusSSR from 'directus-extension-ssr/plugin'
import Unocss from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'

import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueRouter({
      routesFolder: ['src/pages'],
      dts: './src/typed-router.d.ts',
    }),
    Vue(),
    Layouts(),
    DirectusSSR(),
    Unocss(),
  ],
})
