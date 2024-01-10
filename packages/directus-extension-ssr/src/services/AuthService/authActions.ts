import { readMe } from '@directus/sdk'
import type { SSRDirectusClient } from '~/types'

export const signIn = async (directus: SSRDirectusClient, email: string, password: string) => await directus.login(email, password)
export const signOut = async (directus: SSRDirectusClient) => await directus.logout()
export const getCurrentUser = async (directus: SSRDirectusClient) => await directus.request(readMe())
