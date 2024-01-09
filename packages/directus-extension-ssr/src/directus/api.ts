import { config } from './hook'
import type { HookConfig } from '~/types'

export const endpoints = []
export const hooks: { name: string, type: string, config: HookConfig }[] = [
  {
    name: 'directus-extension-ssr',
    type: 'hook',
    config,
  },
]
export const operations = []
