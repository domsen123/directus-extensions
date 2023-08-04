import process from 'node:process'
import { createSSRApp } from 'vue'
import type { Router } from 'vue-router'
import { createHead } from '@vueuse/head'
import { createDirectus, graphql, realtime, rest } from '@directus/sdk'
import type { Request } from 'express'
import type { AppDirectusClient, DirectusSchema, SharedHandler } from '../types'
import { authentication } from './directus/authentication'

const getDirectus = (isClient: boolean): AppDirectusClient => {
  const isServer = !isClient
  const PUBLIC_URL = isServer ? process.env.PUBLIC_URL as string : `${new URL(window.location.href).origin}/`

  return createDirectus<DirectusSchema>(PUBLIC_URL)
    .with(authentication())
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
  const { isClient, initialState, routerOptions, routerType = 'vue-router' } = options

  routerOptions.scrollBehavior ??= scrollBehavior

  const directus = getDirectus(isClient)

  try {
    if (!isClient) {
      const { req, env } = options
      const refresh_token = getCookieValue(req, env.REFRESH_TOKEN_COOKIE_NAME)
      if (refresh_token) {
        await directus.setRefreshToken(refresh_token)
        await directus.refresh()
      }
    }
    else {
      if (initialState.directusCredentials)
        await directus.setCredentials(initialState.directusCredentials)
    }
  }
  catch (error: any) {
    // console.error(error)
  }

  const app = createSSRApp(App)
  // app.provide(InjectDirectus, directus)
  app.provide('directus', directus)

  const vueRouter = routerType === 'vue-router' ? await import('vue-router') : await import('vue-router/auto')

  // @ts-expect-error ...
  const router = vueRouter.createRouter({
    history: !isClient ? vueRouter.createMemoryHistory() : vueRouter.createWebHistory(),
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
