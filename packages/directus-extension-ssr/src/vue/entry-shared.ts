import type { Router } from 'vue-router'
import type { AuthenticationData } from '@directus/sdk'
import type { Schema, SharedHandler } from '../types/index'

const scrollBehavior: Router['options']['scrollBehavior'] = (_, __, savedPosition) => {
  return savedPosition || { top: 0 }
}

// const setupDirectus = async (
//   isClient: boolean,
//   directus: AppDirectusClient,
//   initialState: InitialState,
//   options?: SharedServerOptions | SharedClientOptions,
// ) => {
//   if (isClient) {
//     if (initialState.access_token)
//       await directus.setAccessToken(initialState.access_token)
//   }
//   else {
//     const { req, env } = options as SharedServerOptions

//     const refresh_token = getCookieValue(req, env.REFRESH_TOKEN_COOKIE_NAME)
//     if (refresh_token) {
//       await directus.setRefreshToken(refresh_token)
//       const authData = await directus.refresh()
//       initialState.access_token = authData.access_token
//       initialState.refresh_token = authData.refresh_token
//     }
//   }
// }

export const createApp: SharedHandler = async (App, options) => {
  const { isClient, initialState, routerOptions } = options

  routerOptions.scrollBehavior ??= scrollBehavior

  const storage = (await import('@directus/sdk')).memoryStorage()

  const publicUrl: string = 'env' in options ? options.env.PUBLIC_URL : `${new URL(window.location.href).origin}/`

  const directus = (await import('@directus/sdk')).createDirectus<Schema>(publicUrl)
    .with((await import('@directus/sdk')).authentication(isClient ? 'cookie' : 'json', { storage }))
    .with((await import('@directus/sdk')).rest())
    .with((await import('@directus/sdk')).graphql())
    .with((await import('@directus/sdk')).realtime({ authMode: 'public' }))
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

  const app = (await import('vue')).createSSRApp(App)
  app.provide('directus', directus)

  const router = (await import('vue-router')).createRouter({
    history: !isClient ? (await import('vue-router')).createMemoryHistory() : (await import('vue-router')).createWebHistory(),
    ...routerOptions,
  })

  const head = (await import('@unhead/vue')).createHead()
  app.use(head)

  return {
    app,
    router,
    head,
    directus,
    storage,
  }
}
