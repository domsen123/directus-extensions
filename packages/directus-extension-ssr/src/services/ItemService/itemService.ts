import { createItem, createItems, readItem, readItems } from '@directus/sdk'
import type { CollectionType, Query, RegularCollections, UnpackList } from '@directus/sdk'
import { RequestService } from '../RequestService'
import type { AnyItem } from './itemStore'
import { useItemStore } from './itemStore'
import type { SSRDirectusClient } from '~/types'

type _Collection<Schema extends object> = keyof Schema | RegularCollections<Schema>

export class ItemService<Schema extends object> {
  private itemStore = useItemStore()
  private requestService: RequestService<Schema>

  constructor(directus: SSRDirectusClient<Schema>, private primaryKey: string) {
    this.requestService = new RequestService(directus)
  }

  private storeItem<Collection extends RegularCollections<Schema> | keyof Schema>(collection: Collection, item: AnyItem) {
    const _c = collection as string
    return this.itemStore.storeItem(_c, this.primaryKey, item)
  }

  private storeItems<Collection extends RegularCollections<Schema> | keyof Schema>(collection: Collection, items: AnyItem[]) {
    const _c = collection as string
    return this.itemStore.storeItems(_c, this.primaryKey, items)
  }

  private getItem<Collection extends RegularCollections<Schema> | keyof Schema>(collection: Collection, key: string) {
    const _c = collection as string
    return this.itemStore.getItem(_c, this.primaryKey, key)
  }

  private firstOrNull<T>(items: T[]) {
    return items.length > 0 ? items[0] : null
  }

  async queryItems<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, query: TQuery) {
    const command = readItems<Schema, Collection, TQuery>(collection, query)

    const promise = this.requestService.cachedRequest(command)
    const items = await promise

    if (items.length === 0)
      return items

    const storedItems = this.storeItems(collection, items) as Awaited<typeof promise>

    return storedItems
  }

  async readItem<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, key: string, query?: TQuery) {
    const command = readItem<Schema, Collection, TQuery>(collection, key, query)

    const promise = this.requestService.cachedRequest(command)

    // check if item is already in store and all fields are present
    // const stateItem = this.getItem(collection, key) as Awaited<typeof promise>

    // if (query && query.fields && !query.fields.includes('*')) {
    //   const hasAllFields = query.fields.every(f => stateItem && f as keyof typeof stateItem in stateItem)
    //   console.log('hasAllFields', hasAllFields)
    //   if (hasAllFields)
    //     return { ...stateItem, __cached: true }
    // }
    const item = await promise
    console.log('item', item)

    if (!item)
      return item

    const storedItem = this.storeItem(collection, item) as Awaited<typeof promise>

    return storedItem
  }

  async readItems<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, key: string[], query?: TQuery) {
    return Promise.all(key.map(k => this.readItem(collection, k, query)))
  }

  async createItem<Collection extends keyof Schema, TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, item: Partial<UnpackList<Schema[Collection]>>, query?: TQuery) {
    const command = createItem<Schema, Collection, TQuery>(collection, item, query)

    const promise = this.requestService.cachedRequest(command)
    const createdItem = await promise

    const storedItem = this.storeItem(collection, createdItem) as Awaited<typeof promise>

    return storedItem
  }

  async createItems<Collection extends keyof Schema, TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, items: Partial<UnpackList<Schema[Collection]>>[], query?: TQuery) {
    const command = createItems<Schema, Collection, TQuery>(collection, items, query)

    const promise = this.requestService.cachedRequest(command)
    const createdItems = await promise

    const storedItems = this.storeItems(collection, createdItems) as Awaited<typeof promise>

    return storedItems
  }

  // async updateItems<K extends keyof Schema>(collection: K) {}
  // async updateItem<K extends keyof Schema>(collection: K) {}

  // async deleteItems<K extends keyof Schema>(collection: K) {}
  // async deleteItem<K extends keyof Schema>(collection: K) {}
}
