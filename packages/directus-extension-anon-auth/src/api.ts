import { config as endpointConfig } from './endpoints'
import { config as HookConfig } from './hooks'

export const hooks = [
  {
    // name: 'directus-extension-myprojectplace',
    type: 'hook',
    config: HookConfig,
  },
]
export const operations = []
export const endpoints = [
  {
    // name: 'directus-extension-myprojectplace',
    type: 'endpoint',
    config: endpointConfig,
  },
]
