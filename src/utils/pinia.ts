import { type PiniaPluginContext, defineStore } from 'pinia'
import type { DirectusUser } from '@directus/sdk'
import { createUser, readMe } from '@directus/sdk'
import { isDirectusError } from '@directus/errors'
import type { AppContext, DirectusSchema } from '../types'

export const directusSSRPlugin = ({ store }: PiniaPluginContext, ctx: AppContext) => {
  store.$directus = ctx.directus

  if (ctx.isClient)
    store.$state = (ctx.initialState.pinia) || {}

  else ctx.initialState.pinia = store.$state
}

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [],
  }),
  actions: {
    addError(error: Error) {
      if (isDirectusError(error))
        console.log('directus_error', error)
      else
        console.log('unknown_error', error)
    },
  },
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
  }) as { currentUser: Pick<DirectusUser<DirectusSchema>, 'id' | 'first_name' | 'last_name' | 'email' | 'avatar'> | null },
  actions: {
    async setCurrentUser() {
      try {
        this.currentUser = await this.$directus.request(readMe({
          fields: ['id', 'first_name', 'last_name', 'email', 'avatar'],
        }))
      }
      catch (error: any) {
        this.currentUser = null
      }
    },
    async login(email: string, password: string) {
      try {
        await this.$directus.login(email, password, { mode: 'cookie' })
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
    },
    async logout() {
      try {
        await this.$directus.logout()
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
    },
    async register(first_name: string, last_name: string, email: string, password: string) {
      try {
        await this.$directus.request(createUser({
          first_name, last_name, email, password,
        }))
        await this.login(email, password)
        await this.setCurrentUser()
      }
      catch (error: any) {
        useErrorStore().addError(error)
        throw error
      }
    },
    async resetPassword() {},
  },
})
