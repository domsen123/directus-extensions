import { defineStore } from 'pinia'
import { inject } from 'vue'
import type { AppDirectus } from 'directus-extension-ssr/types'
import type { ID } from '@directus/sdk'

export const useUser = defineStore('blog', {
  state: () => ({
    blogList: [],
  }) as { blogList: { id: ID; title: string }[] },
  actions: {
    async fetchBlogs() {
      if (this.$state.blogList.length > 0) return
      try {
        // Demo for extending "collections.d.ts" to get type safety
        const directus = inject<AppDirectus>('directus')
        await directus?.items('posts').readByQuery({
          filter: { title: { _eq: 'Hello World' } },
        })
      }
      catch (e: any) {
        console.error(e.message)
      }
    },
  },
})
