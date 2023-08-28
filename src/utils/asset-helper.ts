import type { DirectusAssetTransformations } from '../types'
import { useAuthStore } from './pinia'

export const displayThumbnail = (file_id: string, preset?: string | DirectusAssetTransformations) => {
  const authStore = useAuthStore()
  const params = typeof preset === 'string'
    ? { preset, access_token: authStore.accessToken }
    : { ...preset, access_token: authStore.accessToken }

  return `/assets/${file_id}?${new URLSearchParams(params as any).toString()}`
}
