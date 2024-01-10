import type { IProfile } from './IProfile'

export interface ISchema {
  profiles: IProfile[]
  test_collection: Array<{
    uuid: string
    date_created: string
    date_updated: string
    user_created: string
    user_updated: string
    name: string
  }>
}
