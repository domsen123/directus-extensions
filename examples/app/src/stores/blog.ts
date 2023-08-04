import { readItems } from '@directus/sdk'
import type { DirectusSchema } from 'directus-extension-ssr/types'
import { defineStore } from 'pinia'

export const useBlog = defineStore('blog', {
  state: () => ({
    blogList: [],
  }) as { blogList: DirectusSchema['posts'] },
  actions: {
    async fetchBlogs() {
      if (this.$state.blogList.length > 0) return
      try {
        const result = await this.directus.request(readItems('posts'))
        this.$state.blogList = result
      }
      catch (e: any) {
        console.error(e.message)
      }
    },
  },
})
