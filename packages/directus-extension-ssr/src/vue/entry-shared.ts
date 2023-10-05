import { createSSRApp } from 'vue'
import { type Router, createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@unhead/vue'
import type { AuthenticationData, AuthenticationStorage } from '@directus/sdk'
import { authentication, createDirectus, graphql, realtime, rest } from '@directus/sdk'
import type { Request } from 'express'
import type { AppDirectusClient, DirectusSchema, SharedHandler } from '../types'

// import { authentication } from './directus/authentication'

export const memoryStorage = () => {
  let store: AuthenticationData | null = null

  return {
    get: async () => store,
    set: async (value: AuthenticationData | null) => {
      store = value
    },
  } as AuthenticationStorage
}

const getDirectus = (isClient: boolean, storage: AuthenticationStorage, PUBLIC_URL: string): AppDirectusClient => {
  const isServer = !isClient

  return createDirectus<DirectusSchema>(PUBLIC_URL)
    .with(authentication(isServer ? 'json' : 'cookie', { storage }))
    .with(rest())
    .with(graphql())
    .with(realtime({
      authMode: 'public',
    }))
}

export const getCookieValue = (req: Request, cookieName: string): string | null => {
  const cookieHeader = req.headers.cookie
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ')
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if (name === cookieName)
        return value
    }
  }
  return null
}

const scrollBehavior: Router['options']['scrollBehavior'] = (_, __, savedPosition) => {
  return savedPosition || { top: 0 }
}

export const createApp: SharedHandler = async (App, options, hook) => {
  const { isClient, initialState, routerOptions } = options

  routerOptions.scrollBehavior ??= scrollBehavior

  const storage = memoryStorage()

  let directus: AppDirectusClient
  try {
    if (!isClient) {
      const { req, env } = options
      directus = getDirectus(isClient, storage, env.PUBLIC_URL)

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
      directus = getDirectus(isClient, storage, `${new URL(window.location.href).origin}/`)
      if (initialState.access_token)
        directus.setToken(initialState.access_token)
    }
  }
  catch (error: any) {
    console.error('entry-shared', error)
    throw error
  }

  const app = createSSRApp(App)
  app.provide('directus', directus)

  // @ts-expect-error ...
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
