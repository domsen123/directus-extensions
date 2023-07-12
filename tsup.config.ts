import { defineConfig } from 'tsup'

// @ts-expect-error stfu!
export default defineConfig(() => {
  const external = [
    '@directus/sdk',
    '@directus/shared',
    '@directus/types',
    'directus',
    'directus-extension-ssr',
    'directus-extension-ssr/plugin',
    'vite',
    'vue',
    'vue-router',
  ]

  return [
    {
      entry: {
        index: './src/types.ts',
      },
      outDir: 'dist/types',
      clean: false,
      format: ['esm'],
      minify: true,
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
      minify: true,
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
      minify: true,
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
      format: ['cjs'],
      minify: false,
      dts: true,
      external,
    },
  ]
})
