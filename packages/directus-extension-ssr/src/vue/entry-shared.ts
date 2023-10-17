import { createSSRApp } from 'vue'
import { type Router, createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue'
import type { AuthenticationData } from '@directus/sdk'
import { authentication, createDirectus, graphql, memoryStorage, realtime, rest } from '@directus/sdk'
import type { DirectusSchema, SharedHandler } from '../types'
import { getCookieValue } from '../utils'

const scrollBehavior: Router['options']['scrollBehavior'] = (_, __, savedPosition) => {
  return savedPosition || { top: 0 }
}

export const createApp: SharedHandler = async (App, options, hook) => {
  const { isClient, initialState, routerOptions } = options

  routerOptions.scrollBehavior ??= scrollBehavior

  const storage = memoryStorage()

  const publicUrl: string = 'env' in options ? options.env.PUBLIC_URL : `${new URL(window.location.href).origin}/`

  const directus = createDirectus<DirectusSchema>(publicUrl)
    .with(authentication(!isClient ? 'json' : 'cookie', { storage }))
    .with(rest(options.directusOptions?.restConfig ? options.directusOptions.restConfig(options) : undefined))
    .with(graphql(options.directusOptions?.graphqlConfig ? options.directusOptions.graphqlConfig(options) : undefined))
    .with(realtime(
      options.directusOptions?.webSocketConfig
        ? options.directusOptions.webSocketConfig(options)
        : { authMode: 'public' },
    ))

  try {
    if (!isClient) {
      const { req, env } = options

      const refresh_token = getCookieValue(req, env.REFRESH_TOKEN_COOKIE_NAME)
      if (refresh_token) {
        const data = await storage.get() as AuthenticationData
        storage.set({ ...data, refresh_token })

        const authData = await directus.refresh()
        initialState.access_token = authData.access_token
        initialState.refresh_token = authData.refresh_token
      }
    }
    else {
      if (initialState.access_token)
        directus.setToken(initialState.access_token)
    }
  }
  catch (error: any) {
    // console.error('entry-shared', error)
  }

  const app = createSSRApp(App)
  app.provide('directus', directus)

  const router = createRouter({
    history: !isClient ? createMemoryHistory() : createWebHistory(),
    ...routerOptions,
  })

  const head = createHead()
  app.use(head)

  hook && await hook({ app, router, directus, isClient, initialState })

  return {
    app,
    router,
    head,
    directus,
  }
}
