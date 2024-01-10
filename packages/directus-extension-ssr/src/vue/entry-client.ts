import type { ClientHandler, SharedClientOptions } from '../types/index'
import { createApp } from './entry-shared'

export const handler: ClientHandler = async (App, options, hook) => {
  const initialState = window.__INITIAL_STATE__ || {}

  const sharedClientOptions: SharedClientOptions = {
    isClient: true,
    initialState,
    ...options,
  }

  const { app, router, head, directus, storage } = await createApp(App, sharedClientOptions)
  if (initialState.refresh_token) {
    try {
      await directus.refresh()
    }
    catch (error: any) {

    }
  }

  hook && await hook({
    app,
    router,
    head,
    directus,
    storage,
    initialState: sharedClientOptions.initialState,
    isClient: sharedClientOptions.isClient,
    options: sharedClientOptions,
  })

  let entryRoutePath: string | undefined
  let isFirstRoute = true
  router.beforeEach((to) => {
    if (isFirstRoute || (entryRoutePath && entryRoutePath === to.path)) {
      // The first route is rendered in the server and its state is provided globally.
      isFirstRoute = false
      entryRoutePath = to.path
      to.meta.state = initialState.routeState ?? {}
    }
    else {
      // Other routes are rendered in the client and their state is provided locally.
      to.meta.state = {}
    }
  })

  app.use(router)
  await router.isReady()
  app.mount('#app')
}
