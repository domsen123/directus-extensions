import { defineStore } from 'pinia'
import type { Ref } from 'vue'

// export const useItemStore = <
//   Schema extends object,
//   Collection extends RegularCollections<Schema>,
//   Output extends object = object,
// >() => (defineStore<string, ItemStateTree<Schema, Collection, Output>, ItemStateGetters<Schema, Collection, Output>, ItemStateActions<Schema, Collection, Output>>('_item_', {
//     state: (): { items: any[] } => ({
//       items: [],
//     }),
//     actions: {
//       storeItem(collection, item, primaryKey) {
//         const _primaryKey = primaryKey as keyof Output
//         const exist = (this.items as (Output & { __collection: Collection })[]).findIndex(i => i[_primaryKey] === item[_primaryKey] && i.__collection === collection)

//         const _item: Output & { __collection: Collection } = { ...item, __collection: collection }
//         if (exist > -1)
//           (this.items as (Output & { __collection: Collection })[]).splice(exist, 1, _item)
//         else (this.items as (Output & { __collection: Collection })[]).push(_item)
//       },
//       storeItems(collection, items, primaryKey) {
//         items.forEach(item => this.storeItem(collection, item, primaryKey))
//       },
//     },
//   }))()

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
    // @ts-expect-error ...
    getItemsByPrimaryKeys: state => (collection: string, primaryKey: string, keys: Ref<string[]>) => state.items.filter(i => i.__collection === collection && keys.value.includes(i[primaryKey])),
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
