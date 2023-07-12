import { ID } from '@directus/sdk'
import 'directus-extension-ssr/types'

declare module 'directus-extension-ssr/types' {
  interface AppTypeMap {
    posts: {
      id: ID
      title: string
    }
  }
}