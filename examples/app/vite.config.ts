import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DirectusSSR from 'directus-extension-ssr/plugin'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import WebfontDownload from 'vite-plugin-webfont-dl'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-plugin-pages-sitemap'
import Vuetify from 'vite-plugin-vuetify'
import SvgLoader from 'vite-svg-loader'

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    Pages({
      dirs: ['src/views'],
      onRoutesGenerated: routes => generateSitemap({ routes }),
    }),
    Layouts(),
    DirectusSSR(),
    Unocss(),
    WebfontDownload(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
    }),
    Vuetify({ styles: { configFile: 'src/assets/scss/settings.scss' } }),
    SvgLoader(),
  ],
  ssr: {
    noExternal: [/vuetify/],
  },
})
