import { defineStore } from 'pinia'
import { inject } from 'vue'
import type { AppDirectus } from 'directus-extension-ssr/types'

export const useUser = defineStore('user', {
  state: () => ({
    currentUser: null,
  }) as { currentUser: any },
  actions: {
    async fetchCurrentUser() {
      if (this.$state.currentUser) return
      try {
        const directus = inject<AppDirectus>('directus')
        this.$state.currentUser = await directus?.users.me.read({ fields: ['first_name'] })
      }
      catch (e: any) {
        console.error(e.message)
      }
    },
  },
})
