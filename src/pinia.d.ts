import 'pinia'
import type { AppDirectusClient}  from './types'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $directus: AppDirectusClient
  }
}