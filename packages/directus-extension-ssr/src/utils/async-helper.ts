import { computed, ref } from 'vue'

export const createAsyncHelper = <T = unknown>(init: () => Promise<T>, defaultValue: T | null) => {
  const items = ref<any | null>(null)

  const result = computed(() => items.value ?? defaultValue)

  const load = async () => {
    items.value = await init()
    return result
  }

  const resolve = () => {
    load()
    return result
  }

  return {
    load,
    resolve,
  }
}
