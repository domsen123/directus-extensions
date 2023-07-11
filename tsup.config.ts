import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return [
    {
      entry: {
        'vue/entry-server': './src/vue/entry-server.ts',
        'vue/entry-client': './src/vue/entry-client.ts',
        'vue/plugin': './src/vue/plugin.ts',
        'directus/api': './src/directus/api.ts',
        'directus/app': './src/directus/app.ts',
      },
      clean: true,
      target: 'esnext',
      format: ['esm', 'cjs'],
      minify: !options.watch,
      dts: true,
      noExternal: ['@nuxt/devalue'],
      external: [
        '@directus/sdk',
        '@directus/shared',
        '@directus/types',
        'directus',
        'directus-extension-ssr',
        'directus-extension-ssr/plugin',
        'vite',
        'vue',
        'vue-router',
      ],
    },
  ]
})
