import type { UnwrapRef } from 'vue'
import { computed, onMounted, onServerPrefetch, ref, useAttrs } from 'vue'
import { useRoute } from 'vue-router'

interface InitData {
  [key: string]: {
    sync: () => Promise<unknown>
    emit: (defaultValue: unknown) => unknown
    async: (defaultValue: unknown, onError?: (error: Error) => void, onFinally?: () => void) => unknown
    set: (items: any[]) => void
  }
}

interface AttrData<T extends InitData> {
  state: StateData<T>
  errors: ErrorData<T>
  serverPrefetched: ServerPrefetchedData[]
}

type StateData<T extends InitData> = {
  [key in keyof T]?: Awaited<ReturnType<T[key]['emit']>> | null
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

// const createInitFunction = <T = unknown>(fn: () => Promise<T>, defaultValue: T) => {
//   return {
//     then: (thenFn: (value: T) => void) => {
//       fn().then(thenFn).catch(()=> this.catch)
//     },
//     catch: (errorFn: (error: unknown) => void) => {
//       promise.catch(errorFn)
//     },
//     finally: (finallyFn: () => void) => {
//       promise.finally(finallyFn)
//     },
//     resolve: () => {
//       promise.then()
//       return defaultValue
//     },
//   }
// }

/**
 * Custom hook to manage server state in a Vue application.
 *
 * @param {InitData} initFunctions - An object where keys are state properties and values are functions to initialize these properties.
 * @param {number} [stale] - The time in milliseconds after which the server state is considered stale. Default to 5 minutes.
 * @returns An object containing the state, loading status, error checker function, and the initialized functions.
 */
export const useServerState = <T extends InitData = InitData>(initFunctions: T, stale = 1000 * 5 * 60) => {
  const route = useRoute()
  const attrs = useAttrs() as unknown as AttrData<T>

  // Initialize loading state based on the number of init functions
  const isLoading = ref<number>(0)
  const serverPrefetched = ref<ServerPrefetchedData[]>(attrs.serverPrefetched ?? [])

  const stateProps: StateData<T> = {}
  const errorProps: ErrorData<T> = {}

  // Prepare state properties
  for (const key in initFunctions) {
    stateProps[key] = attrs.state?.[key] ?? null
    errorProps[key] = attrs.errors?.[key] ?? null
  }

  const state = ref<StateData<T>>(stateProps)
  const errors = ref<ErrorData<T>>(errorProps)

  // const onSuccess = (key: any, items: unknown) => {
  //   // @ts-expect-error ...
  //   state.value[key as keyof UnwrapRef<StateData<T>>] = items
  //   // @ts-expect-error ...
  //   errors.value[key as keyof UnwrapRef<ErrorData<T>>] = null
  // }

  // const onError = (key: any, error: unknown) => {
  //   errors.value[key as keyof UnwrapRef<ErrorData<T>>] = parseError(error)
  // }

  // const onFinally = (key: any, onServer: boolean) => {
  //   isLoading.value--
  //   if (onServer) {
  //     serverPrefetched.value.push({
  //       key,
  //       at: Date.now(),
  //     })
  //   }
  //   else {
  //     serverPrefetched.value = serverPrefetched.value.filter(s => s.key !== key)
  //   }
  // }

  // const callInitFunction = <K extends keyof InitData>(key: K, fns: InitData[K], onServer: boolean) => {
  //   isLoading.value++
  //   if (onServer) {
  //     return async () => {
  //       try {
  //         const result = await fns().sync()
  //         onSuccess(key, result)
  //       }
  //       catch (error: any) {
  //         onError(key, error)
  //       }
  //       finally {
  //         onFinally(key, onServer)
  //       }
  //     }
  //   }
  //   return (sync: boolean) => {
  //     if (sync)
  //     // @ts-expect-error ...
  //       state.value[key as keyof UnwrapRef<StateData<T>>] = fns().async()

  //     // state.value[key as keyof UnwrapRef<StateData<T>>] = (sync ? fns().async(attrs[key], error => onError(key, error), () => onFinally(key, onServer)) : fns().emit(attrs[key])) ?? attrs[key]
  //   }
  // }

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
    for (const key in initFunctions) {
      if (stateProps[key] === null)
        initFunctions[key].async(null)
      else
        initFunctions[key].set(stateProps[key] as any)

      // @ts-expect-error ...
      state.value[key] = initFunctions[key].emit(null)
    }
    // Object.entries(initFunctions)
    //   .map(([key, fn]) => {
    //     console.log(key, fn)
    //     return callInitFunction(key as keyof InitData, fn, false)(isStaled(key as keyof UnwrapRef<ErrorData<T>>) || isServerPrefetched(key as keyof UnwrapRef<ErrorData<T>>) || hasError(key as keyof UnwrapRef<ErrorData<T>>).value || stateProps[key] === null)
    //   })
  })

  // Prefetch state on the server side
  onServerPrefetch(async () => {
    for (const key in initFunctions) {
      try {
        const result = await initFunctions[key].sync()
        // @ts-expect-error ...
        state.value[key] = result
      }
      catch (error: any) {
        console.error(error)
      }
    }

    // // @ts-expect-error ...
    // await Promise.all(Object.entries(initFunctions).map(([key, fn]) => callInitFunction(key, fn, true)()))
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
