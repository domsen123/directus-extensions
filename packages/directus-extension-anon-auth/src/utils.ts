import type { RestCommand } from '@directus/sdk'
import type { Request } from 'express'

export const parseCookie = (str: string): Record<string, string> => {
  return str
    .split(';')
    .map(cookie => cookie.split('=').map(decodeURIComponent))
    .reduce((acc: Record<string, string>, [name, value]) => {
      acc[name.trim()] = value.trim()
      return acc
    }, {})
}

export const getCookieValue = (cookieName: string, cookieString?: string): string | undefined => {
  if (!cookieString)
    return
  const cookies = parseCookie(cookieString)
  return cookies[cookieName]
}

type ApplyRestConfig = ({ isClient, req }: { isClient: boolean, req?: Request }) => (init: RequestInit) => RequestInit
export const applyRestConfig: ApplyRestConfig = ({ isClient, req }) => (init) => {
  if (isClient)
    init.credentials = 'same-origin'

  if (!isClient && req && req.headers && req.headers.cookie) {
    const headers = new Headers(init.headers)
    headers.set('set-cookie', req.headers.cookie)
    init.headers = headers
  }
  return init
}
export const anonLogin = <Schema extends object>(): RestCommand<void, Schema> => () => ({ path: '/anon/login', method: 'POST' })
