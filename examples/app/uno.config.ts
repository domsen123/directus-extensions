import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [],
  rules: [
    // @ts-expect-error d => number
    [/^i-scale-(\d+)$/, ([, d]) => ({ width: `${d / 4}em`, height: `${d / 4}em` })],
  ],
  theme: {
    colors: {
      primary: '#FF546C',
      secondary: '#8FFFEC',
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      // scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: { sans: 'Mulish:300,400,500,600,700,800,900' },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
