import { computed, onMounted, onServerPrefetch, ref, useAttrs } from 'vue'
import { useRoute } from 'vue-router'

interface Data {
  [key: string]: unknown
  errors: {
    [key: string]: unknown
  }
}

type InitData = Record<string, () => Promise<unknown>>

const parseError = (error: any) => {
  if ('errors' in error)
    return { isDirectusError: true, errors: error.errors }
  else if ('message' in error)
    return error.message
  else return error
}

/**
 * Custom hook to manage server state in a Vue application.
 *
 * @param {InitData} initFunctions - An object where keys are state properties and values are functions to initialize these properties.
 * @returns An object containing the state, loading status, error checker function, and the initialized functions.
 */
export const useServerState = <T extends InitData = InitData>(init: T) => {
  const route = useRoute()
  const attrs = useAttrs() as Data

  // Initialize loading state based on the number of init functions
  const isLoading = ref<number>(0)
  const errorList = ref<string[]>([])
  const stateProps: Data = { errors: {} }

  // Prepare state properties
  for (const key in init)
    stateProps[key] = attrs[key] ?? null

  const state = ref<Data>(stateProps)

  // Initialize each state property function
  const initFunctions: InitData = Object.entries(init).reduce((acc, [key, value]) => {
    acc[key] = async () => {
      isLoading.value++
      try {
        state.value[key] = await value()
        Reflect.deleteProperty(state.value.errors, key)
        errorList.value = errorList.value.filter(e => e !== key)
      }
      catch (error: any) {
        errorList.value.push(key)
        state.value.errors[key] = parseError(error)
      }
      finally {
        isLoading.value--
      }
    }
    return acc
  }, {} as InitData)

  // Computed properties to track loading and errors
  const loading = computed<boolean>({
    get: () => isLoading.value > 0,
    set: (value) => {
      if (value)
        isLoading.value++
      else isLoading.value--
    },
  })
  const hasError = (prop: string) => computed<boolean>(() => !!state.value.errors[prop])

  // On component mount, initialize state for properties that are null
  onMounted(() => {
    Promise.all(Object.entries(initFunctions).filter(([key, _]) => stateProps[key] === null).map(([_, value]) => value()))
  })

  // Prefetch state on the server side
  onServerPrefetch(async () => {
    await Promise.all(Object.values(initFunctions).map(fn => fn()))
    route.meta.state = state.value
  })

  return {
    state,
    loading,
    hasError,
    initFunctions,
  }
}
