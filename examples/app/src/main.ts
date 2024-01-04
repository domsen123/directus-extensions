import { handler } from 'directus-extension-ssr'
import { useAuthStore } from 'directus-extension-ssr/utils'
import { setupLayouts } from 'virtual:generated-layouts'
import { v4 as uuidv4 } from 'uuid'
import App from './App.vue'
import type { UserModule } from './types'
import routes from '~pages'

import '~/assets/styles/main.css'
import 'uno.css'

export default handler(App, {
  routerOptions: {
    routes: setupLayouts(routes),
  },
}, async (ctx) => {
  // install all modules under `modules/`
  Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
    .forEach(i => i.install?.(ctx))

  const authStore = useAuthStore()
  await authStore.setCurrentUser()

  if (!authStore.isAuthenticated) {
    const uuid = uuidv4()
    await authStore.register('Anon', 'User', `${uuid}@anon.ai`, uuid)
  }
})
