import { createUser, passwordRequest, passwordReset, readMe } from '@directus/sdk'
import type { SSRDirectusClient } from '~/types'

export const signIn = async (directus: SSRDirectusClient, email: string, password: string) => {
  return await directus.login(email, password)
}
export const signOut = async (directus: SSRDirectusClient) => {
  return await directus.logout()
}

export const signUp = async (directus: SSRDirectusClient, email: string, password: string) => {
  return await directus.request(createUser({
    email,
    password,
  }))
}
export const getCurrentUser = async (directus: SSRDirectusClient) => {
  return await directus.request(readMe())
}
export const requestPasswordReset = async (directus: SSRDirectusClient, email: string) => {
  return await directus.request(passwordRequest(email))
}
export const resetPassword = async (directus: SSRDirectusClient, reset_token: string, password: string) => {
  return await directus.request(passwordReset(reset_token, password))
}
