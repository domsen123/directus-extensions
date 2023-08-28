import type { MaybeRefOrGetter } from '@vueuse/core'
import type { DirectusSchema } from 'directus-extension-ssr/types'
import { defineStore } from 'pinia'
import type { IBase } from '~/interfaces'

export const useMainStore = defineStore('main', () => {
  const state = ref<Record<string, any>>({})

  const setItem = (item: IBase, collection: keyof DirectusSchema) => {
    state.value[item.id] = { ...item, collection }
  }
  const setItems = (items: IBase[], collection: keyof DirectusSchema) => {
    items.map(i => setItem(i, collection))
  }
  const getItemById = (id: MaybeRefOrGetter<string>) => computed(() => state.value[toValue(id)])
  const getItemByCollection = (collection: MaybeRefOrGetter<keyof DirectusSchema>) => computed(() => Object.values(state.value).find(i => i.collection === toValue(collection)))
  const getItemsByCollection = (collection: MaybeRefOrGetter<keyof DirectusSchema>) => computed(() => Object.values(state.value).filter(i => i.collection === toValue(collection)))

  return {
    setItem,
    setItems,
    getItemById,
    getItemByCollection,
    getItemsByCollection,
  }
})
