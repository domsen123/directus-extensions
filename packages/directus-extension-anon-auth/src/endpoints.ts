import type { EndpointConfig } from '@directus/types'
import { defineEndpoint } from '@directus/extensions-sdk'
import { getCookieValue } from './utils'

export const config: EndpointConfig = defineEndpoint({
  id: 'anon',
  handler: async (router, { services, getSchema, env }) => {
    const { ItemsService } = services

    router.post('/login', async (req, res) => {
      const DirectusUserItemsService = new ItemsService('directus_users', { schema: await getSchema() })
      const TenantItemsService = new ItemsService('tenants', { schema: await getSchema() })

      let user
      const anon = getCookieValue('anon', req.headers.cookie)
      if (anon) {
        const _u = await DirectusUserItemsService.readByQuery({
          filter: {
            _and: [
              { id: { _eq: anon } },
              { provider: { _eq: 'anon' } },
            ],
          },
          limit: 1,
        }, { fields: ['id'] })

        if (_u && _u.length === 1)
          user = _u[0].id
      }
      if (!user) {
        const tenant = await TenantItemsService.createOne({}, { fields: ['uuid'] })
        user = await DirectusUserItemsService.createOne({
          tenant,
          role: env.ANON_DEFAULT_ROLE, // '4be11bb1-769b-4e87-a1ff-1dd27d7c087e',
          status: 'active',
          provider: 'anon',
        }, { fields: ['id'] })
      }

      res.cookie('anon', user, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'lax',
      }).status(204).send()
    })
  },
})
