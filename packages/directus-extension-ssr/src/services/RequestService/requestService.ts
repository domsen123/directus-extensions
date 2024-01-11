import type { RestCommand } from '@directus/sdk'
import { useErrorStore } from '../ErrorService'
import { useRequestStore } from './requestStore'
import type { SSRDirectusClient } from '~/types'

export class RequestService<Schema extends object> {
  private errorStore: ReturnType<typeof useErrorStore>
  private requestStore: ReturnType<typeof useRequestStore>
  constructor(private directus: SSRDirectusClient<Schema>) {
    this.requestStore = useRequestStore()
    this.errorStore = useErrorStore()
  }

  public async cachedRequest<Output>(command: RestCommand<Output, Schema>): Promise<Output> {
    const { body, path, method, params } = command()

    const requestKey = JSON.stringify({
      body,
      path,
      method,
      params,
    })

    const requestPromise = this.request(command)

    const promise = this.requestStore.requestExists(requestKey)
      ? this.requestStore.getRequest<Promise<Output>>(requestKey)
      : this.requestStore.addRequest(requestKey, requestPromise)

    const response = await promise
    this.requestStore.removeRequest(requestKey)

    return response
  }

  public async request<Output>(command: RestCommand<Output, Schema>): Promise<Output> {
    return await this.directus.request(command)
  }
}
