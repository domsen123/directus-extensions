import { defineStore } from 'pinia'
import { readMe } from '@directus/sdk'

export const useUser = defineStore('user', {
  state: () => ({
    currentUser: null,
  }) as { currentUser: any },
  actions: {
    async fetchCurrentUser() {
      if (this.$state.currentUser)
        return
      try {
        const currentUser = await this.directus.request(readMe({ fields: ['first_name'] }))
        this.$state.currentUser = currentUser
      }
      catch (e: any) {
        // console.error(e)
      }
    },
  },
})
