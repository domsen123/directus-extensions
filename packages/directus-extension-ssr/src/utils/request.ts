import type { Request } from 'express'

export const getCookieValue = (req: Request, cookieName: string): string | null => {
  const cookieHeader = req.headers?.cookie
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ')
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if (name === cookieName)
        return value
    }
  }
  return null
}
