import { handler } from 'directus-extension-ssr'
import { readMe } from '@directus/sdk'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import type { UserModule } from './types'
import { useAuth } from './services/useAuth'
import routes from '~pages'

// import '@unocss/reset/tailwind-compat.css'
import '~/assets/styles/main.css'
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

    await useAuth().autoSignIn()

    ctx.router.beforeEach(async (to) => {
      if (to.meta.auth) {
        try {
          await ctx.directus.request(readMe({ fields: ['id'] }))
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
