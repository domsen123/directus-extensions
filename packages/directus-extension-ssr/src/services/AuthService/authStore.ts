import { defineStore } from 'pinia'
import type { getCurrentUser, signIn } from './authActions'

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>
type AuthData = Awaited<ReturnType<typeof signIn>>

interface AuthState {
  currentUser: CurrentUser | null
  authData: AuthData | null
}

export const useAuthStore = defineStore('_auth_', {
  state: (): AuthState => ({
    currentUser: null,
    authData: null,
  }),
  getters: {
    isAuthenticated: state => !!state.currentUser,
    accessToken: state => state.authData?.access_token || null,
  },
  actions: {
    setCurrentUser(currentUser: CurrentUser) {
      this.currentUser = currentUser
    },
    unsetCurrentUser() {
      this.currentUser = null
    },
    setAuthData(authData: AuthData) {
      this.authData = authData
    },
    unsetAuthData() {
      this.authData = null
    },
  },
})
