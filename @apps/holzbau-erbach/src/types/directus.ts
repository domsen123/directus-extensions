import type { DirectusSchema } from 'directus-extension-ssr/types'

type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends any[] ? K : never;
}[keyof T]

type DirectusSchemaArrayKeys<T> = ArrayKeys<T>

export type ArrayKeysInDirectusSchema = DirectusSchemaArrayKeys<DirectusSchema>
