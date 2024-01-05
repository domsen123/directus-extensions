import { defineConfig } from 'tsup'

const minify = true

// @ts-expect-error stfu!
export default defineConfig(() => {
  const external = [
    '@vueuse/head',
    '@directus/sdk',
    '@directus/shared',
    '@directus/types',
    'directus',
    'directus-extension-ssr',
    'directus-extension-ssr/plugin',
    'vite',
    'vue',
    'vue-router',
    'pinia',
  ]

  return [
    {
      entry: {
        index: './src/types.ts',
      },
      outDir: 'dist/types',
      clean: false,
      format: ['esm'],
      minify: false,
      external,
      dts: true,
    },
    {
      entry: {
        api: './src/directus/api.ts',
        app: './src/directus/app.ts',
      },
      outDir: 'dist/directus',
      clean: false,
      target: 'esnext',
      format: ['cjs'],
      minify,
      dts: true,
      noExternal: ['@nuxt/devalue', '@directus/extensions-sdk'],
      external,
    },
    {
      entry: {
        'entry-server': './src/vue/entry-server.ts',
        'entry-client': './src/vue/entry-client.ts',
      },
      outDir: 'dist/vue',
      clean: false,
      target: 'esnext',
      format: ['esm'],
      minify: false,
      dts: true,
      noExternal: ['directus-extension-ssr/types'],
      external,
    },
    {
      entry: {
        plugin: './src/vue/plugin.ts',
      },
      outDir: 'dist/vue',
      clean: false,
      target: 'esnext',
      format: ['cjs', 'esm'],
      minify,
      dts: true,
      external,
    },
    {
      entry: {
        index: './src/utils/index.ts',
      },
      outDir: 'dist/utils',
      clean: false,
      target: 'esnext',
      format: ['esm'],
      minify,
      dts: true,
      external,
    },
  ]
})
