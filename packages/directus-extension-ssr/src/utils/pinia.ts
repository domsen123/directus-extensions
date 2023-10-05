import { type PiniaPluginContext, defineStore } from 'pinia'
import type { AuthenticationData } from '@directus/sdk'
import { createUser, readMe } from '@directus/sdk'
import type { AppContext, CurrentUser } from '../types'

export const directusSSRPlugin = ({ store }: PiniaPluginContext, ctx: AppContext) => {
  store.$directus = ctx.directus

  if (ctx.isClient)
    store.$state = (ctx.initialState.pinia) || {}

  else ctx.initialState.pinia = store.$state
}

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [],
  }) as { errors: Error[] },
  actions: {
    addError(error: Error) {
      console.error(error)
      this.errors.push(error)
    },
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isSigningIn: false,
    isSigningUp: false,
    isSigningOut: false,
    currentUser: null,
    authData: null,
  }) as {
    isSigningIn: boolean
    isSigningUp: boolean
    isSigningOut: boolean
    currentUser: CurrentUser | null
    authData: AuthenticationData | null
  },
  getters: {
    isAuthenticated: state => !!state.currentUser,
    accessToken: state => state.authData?.access_token || null,
  },
  actions: {
    async setCurrentUser() {
      try {
        const response = await this.$directus.request(readMe({
          fields: ['id', 'first_name', 'last_name', 'email', 'avatar'],
        })) as CurrentUser
        this.currentUser = response
      }
      catch (error: any) {
        this.authData = null
        this.currentUser = null
      }
    },
    async login(email: string, password: string) {
      try {
        this.isSigningIn = true
        this.$state.authData = await this.$directus.login(email, password, { mode: 'cookie' })
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
      finally {
        this.isSigningIn = false
      }
    },
    async logout() {
      try {
        this.isSigningOut = true
        await this.$directus.logout()
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
      finally {
        this.isSigningOut = false
      }
    },
    async register(first_name: string, last_name: string, email: string, password: string) {
      try {
        this.isSigningUp = true
        await this.$directus.request(createUser({
          first_name,
          last_name,
          email,
          password,
        }))
        this.$state.authData = await this.$directus.login(email, password, { mode: 'cookie' })
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
      finally {
        this.isSigningUp = false
      }
    },
    async resetPassword() {},
  },
})
