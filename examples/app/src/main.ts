import { handler } from 'directus-extension-ssr'
import { readMe } from '@directus/sdk'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import type { UserModule } from './types'
import routes from '~pages'

import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

export default handler(App,
  {
    routerType: 'unplugin-vue-router',
    routerOptions: {
      routes: setupLayouts(routes),
    },
  },
  async (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))

    ctx.router.beforeEach(async (to) => {
      if (to.meta.auth) {
        try {
          await ctx.directus.request(readMe({ fields: ['id', 'role.id', 'role.admin_access'] }))
        }
        catch (e: any) {
          if (e.errors.some((err: any) => err.extensions.code === 'INVALID_CREDENTIALS')) {
            // TODO Utility function?
            if (ctx.isClient)
              window.location.href = '/admin/login'
            else
              return '/admin/login'
          }
        }
      }
    })
  },
)
