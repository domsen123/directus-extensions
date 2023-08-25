import 'pinia'
import { AppDirectusClient } from 'directus-extension-ssr/types'

declare module 'directus-extension-ssr/types' {
  interface DirectusSchema {
    posts: any[]
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    directus: AppDirectusClient
  }
}