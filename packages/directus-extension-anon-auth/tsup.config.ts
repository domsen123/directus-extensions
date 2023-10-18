import { defineConfig } from 'tsup'

const minify = true

export default defineConfig([
  {
    entry: {
      api: './src/api.ts',
      app: './src/app.ts',
    },
    outDir: 'dist',
    clean: false,
    target: 'esnext',
    format: ['cjs'],
    minify,
    dts: true,
    noExternal: ['@directus/extensions-sdk', '@directus/random', '@directus/errors'],
    external: [
      'directus',
      '@directus/sdk',
      '@directus/shared',
      '@directus/types',
      'directus',
    ],
  },
  {
    entry: ['./src/utils.ts'],
    outDir: 'dist',
    clean: false,
    target: 'esnext',
    format: ['esm'],
    minify,
    dts: true,
    bundle: false,
    external: [
      'directus',
      '@directus/sdk',
      '@directus/shared',
      '@directus/types',
      'directus',
      '@directus/extensions-sdk',
      '@directus/random',
      '@directus/errors',
    ],
  },
])
