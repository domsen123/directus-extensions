import type { ClientHandler, SharedClientOptions } from '../types'
import { createApp } from './entry-shared'

export const handler: ClientHandler = async (App, options, hook) => {
  const initialState = window.__INITIAL_STATE__ || {}

  const sharedClientOptions: SharedClientOptions = {
    isClient: true,
    initialState,
    ...options,
  }

  const { app, router } = await createApp(App, sharedClientOptions, hook)

  app.use(router)

  router.isReady().then(() => {
    setTimeout(() => {
      app.mount('#app')
    }, 2000)
  })
}
