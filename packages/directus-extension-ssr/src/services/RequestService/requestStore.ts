import { defineStore } from 'pinia'

interface ExecutingRequest<T = any> {
  key: string
  promise: Promise<T>
}

export interface RequestState {
  requests: ExecutingRequest[]
}

export const useRequestStore = defineStore('_request_', {
  state: (): RequestState => ({
    requests: [],
  }),
  actions: {
    addRequest<T = any>(key: string, promise: Promise<T>) {
      const existsAtIndex = this.requests.findIndex(r => r.key === key)
      if (existsAtIndex === -1)
        this.requests.push({ key, promise })

      return promise
    },
    getRequest<T = any>(key: string) {
      return this.requests.find(request => request.key === key)?.promise as Promise<T>
    },
    removeRequest(key: string) {
      const existsAtIndex = this.requests.findIndex(r => r.key === key)
      if (existsAtIndex !== -1)
        this.requests.splice(existsAtIndex, 1)
    },
    requestExists(key: string) {
      return !!this.requests.find(request => request.key === key)
    },
  },
})
