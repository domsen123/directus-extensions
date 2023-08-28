import { defineStore } from 'pinia'
import type { AppDirectusClient, DirectusSchema } from 'directus-extension-ssr/types'
import type { DirectusUser } from '@directus/sdk'
import { useUsers } from './useUsers'

export const useAuth = defineStore('auth', () => {
  const client = inject('directus') as AppDirectusClient

  const userStore = useUsers()

  const currentUser = ref<ComputedRef<DirectusUser<DirectusSchema>> | null>(null)

  const signUp = async (first_name: string, last_name: string, email: string, password: string) => {
    try {
      const user = await userStore.create({ first_name, last_name, email, password })
      const auth = await client.login(email, password, { mode: 'cookie' })
      client.setCredentials(auth)
      currentUser.value = user.value
    }
    catch (error: any) {
      console.error(error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const auth = await client.login(email, password, { mode: 'cookie' })
      client.setCredentials(auth)
      const user = await userStore.me()
      currentUser.value = user.value
    }
    catch (error: any) {
      console.error(error)
      throw error
    }
  }

  const autoSignIn = async (): Promise<boolean> => {
    try {
      const user = await userStore.me()
      currentUser.value = user.value
      return true
    }
    catch (error: any) {
      return false
    }
  }

  return {
    currentUser,
    signUp,
    signIn,
    autoSignIn,
  }
})
