/* eslint-disable no-restricted-syntax */
import 'pinia'
import type { AppDirectusClient } from './types'

export {}

declare module 'pinia' {
  interface PiniaCustomProperties {
    $directus: AppDirectusClient
  }
}
