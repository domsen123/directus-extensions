import 'pinia'
import type { AppDirectusClient}  from './types'

declare module 'pinia' {
  interface PiniaCustomProperties {
    $directus: AppDirectusClient
  }
}