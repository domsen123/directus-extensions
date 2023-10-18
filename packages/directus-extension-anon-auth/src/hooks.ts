import { defineHook } from '@directus/extensions-sdk'
import type { Accountability, HookConfig } from '@directus/types'
import { isDirectusError } from '@directus/errors'
import { getCookieValue } from './utils'

export const config: HookConfig = defineHook(async ({ filter }, { services, logger, getSchema, env }) => {
  const { ItemsService } = services
  filter('authenticate', async (ctx: any, { req }) => {
    console.log(req.user)
    if (req.token)
      return

    let accountability: Accountability = ctx

    const anon = getCookieValue('anon', req.headers?.cookie)
    if (anon && !accountability.user) {
      try {
        const userItemsService = new ItemsService('directus_users', { schema: await getSchema() })
        await userItemsService.readOne(anon)
        accountability = {
          ...accountability,
          user: anon,
          role: env.ANON_DEFAULT_ROLE,
          admin: false,
          app: false,
        }
      }
      catch (error: any) {
        if (isDirectusError(error)) {
          if (error.code === 'FORBIDDEN')
            logger.warn('[ANON]: User did not exists anymore!')
        }
      }

      return accountability
    }
  })
})
