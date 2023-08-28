import { createPinia } from 'pinia'
import { directusSSRPlugin } from 'directus-extension-ssr/utils'
import { type UserModule } from '~/types'

export const install: UserModule = (ctx) => {
  const pinia = createPinia()

  pinia.use(p => directusSSRPlugin(p, ctx))

  ctx.app.use(pinia)
}
