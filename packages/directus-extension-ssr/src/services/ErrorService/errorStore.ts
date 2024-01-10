import { defineStore } from 'pinia'

export interface ErrorState {
  errors: {
    ts: number
    error: Error
  }[]
}

export const useErrorStore = defineStore('_error_', {
  state: (): ErrorState => ({
    errors: [],
  }),
  getters: {
    listErrors: state => state.errors.slice().sort((a, b) => b.ts - a.ts).map(error => error.error),
  },
  actions: {
    addError(error: Error, log = false) {
      if (log)
        console.error(error)

      this.errors.push({
        ts: Date.now(),
        error,
      })
    },
  },
})
