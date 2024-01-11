import type { UnwrapRef } from 'vue'
import { computed, onMounted, onServerPrefetch, ref, useAttrs } from 'vue'
import { useRoute } from 'vue-router'

interface InitData {
  [key: string]: Promise<any>
}

interface AttrData<T extends InitData> {
  state: StateData<T>
  errors: ErrorData<T>
  serverPrefetched: ServerPrefetchedData[]
}

type StateData<T extends InitData> = {
  [key in keyof T]?: Awaited<T[key]> | null
}

type ErrorData<T extends InitData> = {
  [key in keyof T]?: unknown | null
}

interface ServerPrefetchedData {
  key: string
  at: number
}

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
 * @param {InitData} init - An object where keys are state properties and values are functions to initialize these properties.
 * @param {number} [stale] - The time in milliseconds after which the server state is considered stale. Default to 5 minutes.
 * @returns An object containing the state, loading status, error checker function, and the initialized functions.
 */
export const useServerState = <T extends InitData = InitData>(init: T, stale = 1000 * 5 * 60) => {
  const route = useRoute()
  const attrs = useAttrs() as unknown as AttrData<T>

  // Initialize loading state based on the number of init functions
  const isLoading = ref<number>(0)
  const serverPrefetched = ref<ServerPrefetchedData[]>(attrs.serverPrefetched ?? [])

  const stateProps: StateData<T> = {}
  const errorProps: ErrorData<T> = {}

  // Prepare state properties
  for (const key in init) {
    stateProps[key] = attrs.state?.[key] ?? null
    errorProps[key] = attrs.errors?.[key] ?? null
  }

  const state = ref<StateData<T>>(stateProps)
  const errors = ref<ErrorData<T>>(errorProps)

  const onSuccess = (key: any, result: any) => {
    state.value[key as keyof UnwrapRef<StateData<T>>] = result
    // @ts-expect-error ...
    errors.value[key as keyof UnwrapRef<ErrorData<T>>] = null
  }
  const onError = (key: any, error: Error) => {
    errors.value[key as keyof UnwrapRef<ErrorData<T>>] = parseError(error)
  }

  // Initialize each state property function
  const initFunctions: any = Object.entries(init).reduce((acc, [_key, value]) => {
    const key = _key as keyof InitData
    acc[key] = async (onServer = false) => {
      isLoading.value++

      if (onServer) {
        try {
          const result = await value ?? undefined
          onSuccess(key, result)
        }
        catch (error: any) {
          onError(key, error)
        }
        finally {
          isLoading.value--
          serverPrefetched.value.push({
            // @ts-expect-error ...
            key,
            at: Date.now(),
          })
        }
      }
      else {
        const result = value ?? undefined
        onSuccess(key, result)
        // value
        //   .then(result => onSuccess(key, result))
        //   .catch(error => onError(key, error)).finally(() => {
        //     isLoading.value--
        //     serverPrefetched.value = serverPrefetched.value.filter(s => s.key !== key)
        //   })
      }

      // try {
      //   state.value[key as keyof UnwrapRef<StateData<T>>] = await value ?? undefined
      //   // @ts-expect-error ...
      //   errors.value[key as keyof UnwrapRef<ErrorData<T>>] = null
      // }
      // catch (error: any) {
      //   errors.value[key as keyof UnwrapRef<ErrorData<T>>] = parseError(error)
      // }
      // finally {
      //   isLoading.value--
      //   if (onServer) {
      //     serverPrefetched.value.push({
      //       // @ts-expect-error ...
      //       key,
      //       at: Date.now(),
      //     })
      //   }
      //   else {
      //     serverPrefetched.value = serverPrefetched.value.filter(s => s.key !== key)
      //   }
      // }
    }
    return acc
  }, {} as Record<string, any>)

  // Computed properties to track loading and errors
  const loading = computed<boolean>({
    get: () => isLoading.value > 0,
    set: (value) => {
      if (value)
        isLoading.value++
      else isLoading.value--
    },
  })

  const isServerPrefetched = (prop: keyof UnwrapRef<ErrorData<T>>) => serverPrefetched.value.findIndex(s => s.key === prop) > -1

  const hasError = (key: keyof UnwrapRef<ErrorData<T>>) => computed<boolean>(() => !!errors.value[key])
  const getError = (key: keyof UnwrapRef<ErrorData<T>>) => computed<unknown>(() => errors.value[key])
  const isStaled = (key: keyof UnwrapRef<ErrorData<T>>) => {
    if (isServerPrefetched(key)) {
      const serverPrefetchedAt = serverPrefetched.value.find(s => s.key === key)?.at ?? 0
      return Date.now() - serverPrefetchedAt > stale
    }
    return false
  }

  // On component mount, initialize state for properties that are null
  onMounted(() => {
    Promise.all(Object.entries(initFunctions)
    // .filter(([key, _]) => {
    //   if (isStaled(key as keyof UnwrapRef<ErrorData<T>>))
    //     return true

      //   return stateProps[key] === null && !isServerPrefetched(key as keyof UnwrapRef<ErrorData<T>>) && !hasError(key as keyof UnwrapRef<ErrorData<T>>).value && isStaled(key as keyof UnwrapRef<ErrorData<T>>)
      // })
      // @ts-expect-error ...
      .map(([_, fn]) => fn()))
  })

  // Prefetch state on the server side
  onServerPrefetch(async () => {
    // @ts-expect-error ...
    await Promise.all(Object.values(initFunctions).map(fn => fn(true)))
    route.meta.state = {
      state: state.value ?? {},
      errors: errors.value ?? {},
      serverPrefetched: serverPrefetched.value ?? [],
    }
  })

  return {
    state,
    errors,
    loading,
    initFunctions,
    serverPrefetched,
    hasError,
    getError,
    isStaled,
  }
}
