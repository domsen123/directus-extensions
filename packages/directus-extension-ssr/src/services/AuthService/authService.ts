import { useErrorStore } from '../ErrorService'
import { getCurrentUser, requestPasswordReset, resetPassword, signIn, signOut, signUp } from './authActions'
import { useAuthStore } from './authStore'
import type { SSRDirectusClient } from '~/types'

export class AuthService<Schema extends object> {
  private authStore: ReturnType<typeof useAuthStore>
  private errorStore: ReturnType<typeof useErrorStore>
  constructor(private directus: SSRDirectusClient<Schema>) {
    this.authStore = useAuthStore()
    this.errorStore = useErrorStore()
  }

  async getCurrentUser() {
    try {
      const response = await getCurrentUser(this.directus)
      this.authStore.setCurrentUser(response)
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      this.authStore.unsetCurrentUser()
      this.authStore.unsetAuthData()
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response = await signIn(this.directus, email, password)
      this.authStore.setAuthData(response)
      await this.getCurrentUser()
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      this.authStore.unsetAuthData()
      throw error
    }
  }

  async signOut() {
    try {
      await signOut(this.directus)
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      throw error
    }
    finally {
      this.authStore.unsetCurrentUser()
      this.authStore.unsetAuthData()
    }
  }

  async signUp(email: string, password: string) {
    try {
      await signUp(this.directus, email, password)
      await this.signIn(email, password)
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      this.authStore.unsetAuthData()
      throw error
    }
  }

  async requestPasswordReset(email: string) {
    try {
      await requestPasswordReset(this.directus, email)
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      throw error
    }
  }

  async resetPassword(reset_token: string, password: string) {
    try {
      await resetPassword(this.directus, reset_token, password)
    }
    catch (error: any) {
      this.errorStore.addError(error, import.meta.env.DEV)
      throw error
    }
  }
}
