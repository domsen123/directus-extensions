import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import type { UserModule } from '~/types'

const colors = {
  primary: '#FF546C',
  secondary: '#8FFFEC',
  error: '#FF6666',
  info: '#2196F3',
  success: '#00D68F',
  warning: '#FB8C00',
}

export const install: UserModule = ({ app }) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'light',
      themes: {
        dark: {
          colors: {
            surface: '#1A1A1A',
            ...colors,
          },
        },
        light: {
          colors,
        },
      },
    },
    defaults: {
      VBtn: {
        class: 'text-overline font-weight-bold',
      },
    },
  })
  app.use(vuetify)
}
