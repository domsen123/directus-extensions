import { defineStore } from 'pinia'
import type { Ref } from 'vue'

export type AnyItem = Record<string, unknown>

interface StateItem extends AnyItem {
  __collection: string
  __stored: string
}

interface ItemState {
  items: StateItem[]
}

export const useItemStore = defineStore('_item_', {
  state: (): ItemState => ({
    items: [],
  }),
  getters: {
    getItemsByKeys: state => (collection: string, primaryKey: string, keys: Ref<string[] | null>) => {
      // @ts-expect-error ...
      return keys.value ? state.items.filter(i => i.__collection === collection && keys.includes(i[primaryKey])) : null
    },
  },
  actions: {
    storeItem(collection: string, primaryKey: string, item: AnyItem) {
      const existsAtIndex = this.items.findIndex(i => i.__collection === collection && i[primaryKey] === item[primaryKey])

      const stateItem: StateItem = { ...item, __collection: collection, __stored: new Date().toISOString() }

      if (existsAtIndex > -1)
        this.items.splice(existsAtIndex, 1, stateItem)

      else
        this.items.push(stateItem)
    },
    storeItems(collection: string, primaryKey: string, items: AnyItem[]) {
      items.map(item => this.storeItem(collection, primaryKey, item))
    },
  },
})
