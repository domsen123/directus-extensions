import { createItem, createItems, deleteItem, deleteItems, readItem, readItems, updateItem, updateItems } from '@directus/sdk'
import type { CollectionType, Query, RegularCollections, UnpackList } from '@directus/sdk'
import { RequestService } from '../RequestService'
import type { SSRDirectusClient } from '~/types'

export class ItemService<Schema extends object> {
  private requestService: RequestService<Schema>

  constructor(directus: SSRDirectusClient<Schema>, private primaryKey: string) {
    this.requestService = new RequestService(directus)
  }

  async queryItems<Collection extends RegularCollections<Schema>, TQuery extends Query<Schema, CollectionType<Schema, Collection>>>(collection: Collection, query: TQuery | undefined) {
    const command = readItems<Schema, Collection, TQuery>(collection, query)
    return await this.requestService.cachedRequest(command)
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
