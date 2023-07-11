import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import type { AppDirectus } from 'directus-extension-ssr/types'

export const useUser = defineStore('user', () => {
  const currentUser = ref<any>(null)

  const fetchCurrentUser = async (prefetch = false) => {
    console.log('fetchCurrentUser', prefetch)
    const directus = inject<AppDirectus>('directus')
    try {
      currentUser.value = await directus?.users.me.read({ fields: ['first_name'] })
      return currentUser.value
    }
    catch (error: any) {
      console.error(error.message)
    }
  }

  return {
    currentUser,
    fetchCurrentUser,
  }
})
