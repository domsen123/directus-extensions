import { defineStore } from 'pinia'
import type { RequestState } from '~/types'

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    requests: [],
  } as RequestState),
  actions: {
    addRequest<T = Promise<any>>(key: string, promise: Promise<T>) {
      const existsAtIndex = this.requests.findIndex(r => r.key === key)
      if (existsAtIndex === -1)
        this.requests.push({ key, promise })

      return promise
    },
    getRequest<T = Promise<any>>(key: string): T {
      return this.requests.find(r => r.key === key)?.promise as T
    },
    removeRequest(key: string) {
      const existsAtIndex = this.requests.findIndex(r => r.key === key)
      if (existsAtIndex !== -1)
        this.requests.splice(existsAtIndex, 1)
    },
    requestExists(key: string): boolean {
      return !!this.requests.find(r => r.key === key)
    },
  },
})
