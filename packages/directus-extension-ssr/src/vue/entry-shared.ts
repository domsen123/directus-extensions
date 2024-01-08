import type { Router } from 'vue-router'
import { createHead } from '@unhead/vue'
import type { AuthenticationData } from '@directus/sdk'
import { authentication, createDirectus, graphql, memoryStorage, realtime, rest } from '@directus/sdk'
import type { AppDirectusClient, DirectusSchema, InitialState, SharedClientOptions, SharedHandler, SharedServerOptions } from '../types'
import { getCookieValue } from '../utils'

const scrollBehavior: Router['options']['scrollBehavior'] = (_, __, savedPosition) => {
  return savedPosition || { top: 0 }
}

const setupDirectus = async (
  isClient: boolean,
  directus: AppDirectusClient,
  initialState: InitialState,
  options?: SharedServerOptions | SharedClientOptions,
) => {
  if (isClient) {
    if (initialState.access_token)
      await directus.setAccessToken(initialState.access_token)
  }
  else {
    const { req, env } = options as SharedServerOptions

    const refresh_token = getCookieValue(req, env.REFRESH_TOKEN_COOKIE_NAME)
    if (refresh_token) {
      await directus.setRefreshToken(refresh_token)
      const authData = await directus.refresh()
      initialState.access_token = authData.access_token
      initialState.refresh_token = authData.refresh_token
    }
  }
}

export const createApp: SharedHandler = async (App, options, hook) => {
  const { isClient, initialState, routerOptions } = options

  routerOptions.scrollBehavior ??= scrollBehavior

  const storage = memoryStorage()

  const publicUrl: string = 'env' in options ? options.env.PUBLIC_URL : `${new URL(window.location.href).origin}/`

  const directus = createDirectus<DirectusSchema>(publicUrl)
    .with(authentication(isClient ? 'cookie' : 'json', { storage }))
    .with(rest(options.directusOptions?.restConfig ? options.directusOptions.restConfig(options) : undefined))
    .with(graphql(options.directusOptions?.graphqlConfig ? options.directusOptions.graphqlConfig(options) : undefined))
    .with(realtime(
      options.directusOptions?.webSocketConfig
        ? options.directusOptions.webSocketConfig(options)
        : { authMode: 'public' },
    ))
    .with(() => ({
      setAccessToken: async (access_token: string | null = null) => {
        const data = await storage.get() as AuthenticationData
        initialState.access_token = access_token
        await storage.set({ ...data, access_token })
      },
      setRefreshToken: async (refresh_token: string | null = null) => {
        const data = await storage.get() as AuthenticationData
        initialState.refresh_token = refresh_token
        await storage.set({ ...data, refresh_token })
      },
      setAuthData: async (data: AuthenticationData) => {
        initialState.access_token = data.access_token
        initialState.refresh_token = data.refresh_token
        await storage.set(data)
      },
    }))

  try {
    await setupDirectus(isClient, directus, initialState, options)
  }
  catch (error: any) {
    // console.error('entry-shared', error)
  }

  const app = (await import('vue')).createSSRApp(App)
  app.provide('directus', directus)

  const router = (await import('vue-router')).createRouter({
    history: !isClient ? (await import('vue-router')).createMemoryHistory() : (await import('vue-router')).createWebHistory(),
    ...routerOptions,
  })

  const head = createHead()
  app.use(head)

  try {
    // @ts-expect-error stfu!
    hook && await hook({ app, router, directus, isClient, initialState, options })
  }
  catch (error: any) {
    console.error(error)
  }

  return {
    app,
    router,
    head,
    directus,
    storage,
    initialState,
  }
}
