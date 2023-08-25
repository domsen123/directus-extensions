import { type DirectusUser, createUser, readMe } from '@directus/sdk'
import type { AppDirectusClient, DirectusSchema } from 'directus-extension-ssr/types'
import { defineStore } from 'pinia'
import { findSave, setArray } from '~/utils'

export const useUsers = defineStore('directus_users', () => {
  const client = inject('directus') as AppDirectusClient

  const defaultFields: any[] = ['id', 'first_name', 'last_name', 'email', 'avatar']

  const users = ref<DirectusUser<DirectusSchema>[]>([])

  const me = async (): Promise<ComputedRef<DirectusUser<DirectusSchema>>> => {
    try {
      const data = await client.request(readMe({
        fields: ['*'],
      })) as DirectusUser<DirectusSchema>

      setArray(users, item => item.id === data.id, data)
      return computed(() => findSave(users.value, item => item.id === data.id))
    }
    catch (error: any) {
      console.error(error)
      throw error
    }
  }

  const create = async (user: Pick<DirectusUser<DirectusSchema>, 'first_name' | 'last_name' | 'email' | 'password'> & Partial<DirectusUser<DirectusSchema>>): Promise<ComputedRef<DirectusUser<DirectusSchema>>> => {
    try {
      const data = await client.request(createUser(user, {
        fields: [...defaultFields],
      })) as DirectusUser<DirectusSchema>

      users.value.push(data)
      return computed(() => findSave(users.value, item => item.id === data.id))
    }
    catch (error: any) {
      console.error(error)
      throw error
    }
  }

  return {
    users,
    me,
    create,
  }
})
