import { handler } from 'directus-extension-ssr'
import App from './App.vue'
import type { UserModule } from './types'
import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

export default handler(App,
  {
    routes: [
      { path: '/', component: () => import('./pages/Home.vue') },
      { path: '/about', component: () => import('./pages/About.vue') },
    ],
  },
  async (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
