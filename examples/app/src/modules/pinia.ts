import { createPinia } from 'pinia'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, initialState, directus, app }) => {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    store.directus = directus
  })

  app.use(pinia)

  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else initialState.pinia = pinia.state.value
}
