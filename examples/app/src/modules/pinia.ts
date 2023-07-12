import { createPinia } from 'pinia'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ isClient, initialState, app }) => {
  const pinia = createPinia()

  if (isClient) {
    console.log(initialState.pinia)
    pinia.state.value = (initialState.pinia) || {}
  }

  else { initialState.pinia = pinia.state.value }
}