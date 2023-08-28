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
    breakpoints: {
      'sm': '600px',
      'md': '960px',
      'lg': '1280px',
      'xl': '1920px',
      '2xl': '2560px',
    },
    colors: {
      primary: '#144D33',
      accent: '#FFD400',
    },
    container: {
      center: true,
      padding: {
        'DEFAULT': '1rem',
        'sm': '4rem',
        'md': '4rem',
        'lg': '8rem',
        'xl': '24rem',
        '2xl': '32rem',
      },
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
  safelist: 'prose m-auto text-left font-medium'.split(' '),
})
