import { createItem, createItems, deleteItem, deleteItems, readItem, readItems, updateItem, updateItems } from '@directus/sdk'
import type { CollectionType, Query, RegularCollections, UnpackList } from '@directus/sdk'
import type { Ref } from 'vue'
import { computed, ref, unref, watch } from 'vue'
import { RequestService } from '../RequestService'
import { useItemStore } from './itemStore'
import type { SSRDirectusClient } from '~/types'

export class ItemService<Schema extends object> {
  private itemStore = useItemStore()
  private requestService: RequestService<Schema>

  constructor(directus: SSRDirectusClient<Schema>) {
    this.requestService = new RequestService(directus)
  }

  private storeItem = <Collection extends RegularCollections<Schema> | keyof Schema, Key extends keyof CollectionType<Schema, Collection>>(collection: Collection, primaryKey: Key, item: any) => {
    this.itemStore.storeItem(collection as string, primaryKey as string, item)
  }

  private storeItems = <Collection extends RegularCollections<Schema> | keyof Schema, Key extends keyof CollectionType<Schema, Collection>>(collection: Collection, primaryKey: Key, items: any[]) => {
    this.itemStore.storeItems(collection as string, primaryKey as string, items)
  }

  queryItems<Collection extends RegularCollections<Schema>, PrimaryKey extends keyof CollectionType<Schema, Collection>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, primaryKey: PrimaryKey, query: Ref<TQuery>) {
    const ids = ref<CollectionType<Schema, Collection>[PrimaryKey][]>([])

    const result = computed(() => this.itemStore.getItemsByPrimaryKeys(collection as string, primaryKey as string, ids))

    const fetchItems = import.meta.env.SSR
      ? async () => {
        console.log('fetching items SSR')
        const command = readItems<Schema, Collection, TQuery>(collection, unref(query))

        const items = await this.requestService.cachedRequest(command)
        this.storeItems(collection, primaryKey, items)
        // @ts-expect-error ...
        ids.value = items.map(item => item[primaryKey])
        return result
      } : () => {
        console.log('fetching items CLIENT')
        const command = readItems<Schema, Collection, TQuery>(collection, unref(query))
        this.requestService.cachedRequest(command).then((items) => {
          this.storeItems(collection, primaryKey, items)
          // @ts-expect-error ...
          ids.value = items.map(item => item[primaryKey])
        })
        return result
      }

    watch(query, async () => {
      console.log('query changed')
      await fetchItems()
    })

    return fetchItems()
  }

  async readItem<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, key: string, query?: TQuery | undefined) {
    const command = readItem<Schema, Collection, TQuery>(collection, key, query)
    return await this.requestService.cachedRequest(command)
  }

  async readItems<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, keys: string[], query?: TQuery | undefined) {
    return Promise.all(keys.map(key => this.readItem(collection, key, query)))
  }

  async createItem<Collection extends keyof Schema, TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, item: Partial<UnpackList<Schema[Collection]>>, query?: TQuery | undefined) {
    const command = createItem<Schema, Collection, TQuery>(collection, item, query)
    return await this.requestService.request(command)
  }

  async createItems<Collection extends keyof Schema, TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, items: Partial<UnpackList<Schema[Collection]>>[], query?: TQuery | undefined) {
    const command = createItems<Schema, Collection, TQuery>(collection, items, query)
    return await this.requestService.request(command)
  }

  async updateItem<Schema extends object, Collection extends keyof Schema, const TQuery extends Query<Schema, Schema[Collection]>, Item = UnpackList<Schema[Collection]>>(collection: Collection, key: string | number, item: Partial<Item>, query?: TQuery | undefined) {
    const command = updateItem<Schema, Collection, TQuery, Item>(collection, key, item, query)
    return await this.requestService.cachedRequest(command)
  }

  async updateItems<Schema extends object, Collection extends keyof Schema, const TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, keysOrQuery: string[] | number[] | Query<Schema, Schema[Collection]>, update: Partial<UnpackList<Schema[Collection]>>, query?: TQuery | undefined) {
    const command = updateItems<Schema, Collection, TQuery>(collection, keysOrQuery, update, query)
    return await this.requestService.cachedRequest(command)
  }

  async deleteItem<Schema extends object, Collection extends keyof Schema>(collection: Collection, key: string | number) {
    const command = deleteItem<Schema, Collection>(collection, key)
    return await this.requestService.cachedRequest(command)
  }

  async deleteItems<Schema extends object, Collection extends keyof Schema, const TQuery extends Query<Schema, Schema[Collection]>>(collection: Collection, keysOrQuery: string[] | number[] | TQuery) {
    const command = deleteItems<Schema, Collection, TQuery>(collection, keysOrQuery)
    return await this.requestService.cachedRequest(command)
  }
}
