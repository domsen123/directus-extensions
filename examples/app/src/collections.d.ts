import 'directus-extension-ssr/types'

declare module 'directus-extension-ssr/types' {
  interface DirectusSchema {
    posts: {
      id: string | number
      title: string
      content: string
    }[]
  }
}