import { handler } from 'directus-extension-ssr'
import { setupLayouts } from 'virtual:generated-layouts'
import { readSingleton } from '@directus/sdk'
import App from './App.vue'
import type { UserModule } from './types'
import routes from '~pages'

import '@unocss/reset/tailwind-compat.css'
import '~/assets/styles/main.css'
import 'uno.css'

export default handler(App,
  {
    routerOptions: {
      routes: setupLayouts(routes),
      scrollBehavior(to, _, savedPosition) {
        if (to.hash) {
          return {
            el: to.hash,
            behavior: 'smooth',
          }
        }
        return savedPosition || { top: 0 }
      },
    },
  },
  async (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))

    try {
      const store = useMainStore()
      const result = await ctx.directus.request(readSingleton('info_company'))
      store.setItem(result, 'info_company')
    }
    catch (error: any) {
      console.error(error)
    }
  },
)
