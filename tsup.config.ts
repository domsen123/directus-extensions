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
        api: './src/directus/api.ts',
        app: './src/directus/app.ts',
      },
      outDir: 'dist/directus',
      clean: true,
      target: 'esnext',
      format: ['cjs'],
      minify: false,
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
      clean: true,
      target: 'esnext',
      format: ['esm'],
      minify: false,
      dts: true,
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
      external,
    },
  ]
})
