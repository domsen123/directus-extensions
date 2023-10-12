import { defineConfig } from 'tsup'

const minify = false

export default defineConfig([{
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
  noExternal: ['@directus/extensions-sdk'],
  external: [
    'directus',
    '@directus/sdk',
    '@directus/shared',
    '@directus/types',
    'directus',
  ],
}])
