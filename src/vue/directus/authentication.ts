import type { AuthenticationConfig, AuthenticationData, AuthenticationMode, DirectusClient, loginOptions } from '@directus/sdk'
import { authentication as _authentication, memoryStorage } from '@directus/sdk'
import type { DirectusSchema, ExtendedAuthenticationClient } from '../../types'
import { getRequestUrl } from './get-request-url'
import { request } from './request'

const defaultConfigValues = {
  msRefreshBeforeExpires: 30000, // 30 seconds
  autoRefresh: true,
}

/**
 * Creates a client to authenticate with Directus.
 *
 * @param mode AuthenticationMode
 * @param config The optional configuration.
 *
 * @returns A Directus authentication client.
 */

export const authentication = (mode: AuthenticationMode = 'json', config: AuthenticationConfig = {}) => {
  return (client: DirectusClient<DirectusSchema>): ExtendedAuthenticationClient => {
    config = { ...defaultConfigValues, ...config }
    let refreshPromise: Promise<AuthenticationData> | null = null
    let refreshTimeout: NodeJS.Timer | null = null
    const storage = memoryStorage()

    const autoRefresh = 'autoRefresh' in config ? config.autoRefresh : defaultConfigValues.autoRefresh

    const msRefreshBeforeExpires = typeof config.msRefreshBeforeExpires === 'number' ? config.msRefreshBeforeExpires : defaultConfigValues.msRefreshBeforeExpires

    const resetStorage = () => {
      storage.set({ access_token: null, refresh_token: null, expires: null, expires_at: null })
    }

    const setCredentials = (data: AuthenticationData) => {
      const expires = data.expires ?? 0
      data.expires_at = new Date().getTime() + expires
      storage.set(data)

      if (autoRefresh && expires > msRefreshBeforeExpires && expires < Number.MAX_SAFE_INTEGER) {
        // @ts-expect-error ...
        if (refreshTimeout) clearTimeout(refreshTimeout)

        refreshTimeout = setTimeout(() => {
          refreshTimeout = null

          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          refresh().catch((_err) => {
            /* throw err; */
          })
        }, expires - msRefreshBeforeExpires)
      }
    }

    const getCredentials = async (): Promise<AuthenticationData | null> => {
      return await storage.get() as AuthenticationData | null
    }

    const refresh = async () => {
      const awaitRefresh = async () => {
        const authData = await storage.get()
        resetStorage()

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        } as RequestInit

        if (mode === 'json' && authData?.refresh_token) {
          options.body = JSON.stringify({
            refresh_token: authData.refresh_token,
          })
        }

        const requestUrl = getRequestUrl(client.url, '/auth/refresh')

        const data = await request<AuthenticationData>(requestUrl.toString(), options).catch((err) => {
          throw err
        })

        setCredentials(data)
        return data
      }

      refreshPromise = awaitRefresh().catch((err) => {
        throw err
      })

      return refreshPromise
    }

    const activeRefresh = async () => {
      try {
        await refreshPromise
      }
      finally {
        refreshPromise = null
      }
    }

    const refreshIfExpired = async () => {
      const authData = await storage.get()

      if (refreshPromise || !authData?.expires_at) {
        await activeRefresh()
        return
      }

      if (authData.expires_at < new Date().getTime() + msRefreshBeforeExpires) {
        refresh().catch((_err) => {
          /* throw err; */
        })
      }

      await activeRefresh()
    }

    return {
      setCredentials,
      getCredentials,
      refresh,
      async login(email: string, password: string, options: loginOptions = {}) {
        // TODO: allow for websocket only authentication
        resetStorage()

        const authPath = options.provider ? `/auth/login/${options.provider}` : '/auth/login'
        const requestUrl = getRequestUrl(client.url, authPath)

        const authData: Record<string, string | undefined> = { email, password }
        if ('otp' in options) authData.otp = options.otp
        if ('mode' in options) authData.mode = options.mode

        const data = await request<AuthenticationData>(requestUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authData),
        })

        setCredentials(data)
        return data
      },
      async logout() {
        const authData = await storage.get()

        const options: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }

        if (mode === 'json' && authData?.refresh_token) {
          options.body = JSON.stringify({
            refresh_token: authData.refresh_token,
          })
        }

        const requestUrl = getRequestUrl(client.url, '/auth/logout')
        await request(requestUrl.toString(), options, null)

        // @ts-expect-error ...
        if (refreshTimeout) clearTimeout(refreshTimeout)
        resetStorage()
      },
      async getToken() {
        await refreshIfExpired()

        const data = await storage.get()
        return data?.access_token ?? null
      },
      async setToken(access_token: string | null) {
        let data = await storage.get() as AuthenticationData
        if (data) {
          data.access_token = access_token
        }
        else {
          data = {
            access_token,
            refresh_token: null,
            expires: null,
            expires_at: null,
          }
        }
        await storage.set(data)
      },
      async setRefreshToken(refresh_token: string | null) {
        let data = await storage.get() as AuthenticationData
        if (data) {
          data.refresh_token = refresh_token
        }
        else {
          data = {
            access_token: null,
            refresh_token,
            expires: null,
            expires_at: null,
          }
        }
        await storage.set(data)
      },
    }
  }
}
