import { handler } from 'directus-extension-ssr'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import type { UserModule } from './types'
import routes from '~pages'
import '~/assets/styles/main.css'

export default handler(App, {
  routerOptions: {
    routes: setupLayouts(routes),
  },
  debug: 1000,
}, async (ctx) => {
  // install all modules under `modules/`
  Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
    .forEach(i => i.install?.(ctx))
})
