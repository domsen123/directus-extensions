import type { SharedClientOptions, UserHandler } from '../types'
import { createApp } from './entry-shared'

export const handler: UserHandler = async (App, options, hook) => {
  const _initialState = window.__INITIAL_STATE__ || {}

  const sharedClientOptions: SharedClientOptions = {
    isClient: true,
    initialState: _initialState,
    ...options,
  }

  const { app, router, initialState } = await createApp(App, sharedClientOptions, hook)

  let entryRoutePath: string | undefined
  let isFirstRoute = true
  router.beforeEach((to) => {
    if (isFirstRoute || (entryRoutePath && entryRoutePath === to.path)) {
      // The first route is rendered in the server and its state is provided globally.
      isFirstRoute = false
      entryRoutePath = to.path
      to.meta.state = initialState.routeState
    }
  })

  app.use(router)
  await router.isReady()
  app.mount('#app')
}
