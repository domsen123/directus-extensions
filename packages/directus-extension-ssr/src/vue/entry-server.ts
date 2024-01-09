import { renderToString } from 'vue/server-renderer'
import { renderSSRHead } from '@unhead/ssr'
import type { ServerHandler, SharedServerOptions } from '../types/index'
import { createApp } from './entry-shared'
import { getCookieValue } from '~/utils'

const renderPreloadLink = (file: string): string => {
  if (file.endsWith('.js'))
    return `<link rel="modulepreload" crossorigin href="${file}">`

  else if (file.endsWith('.css'))
    return `<link rel="stylesheet" href="${file}">`

  else if (file.endsWith('.woff'))
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`

  else if (file.endsWith('.woff2'))
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`

  else if (file.endsWith('.gif'))
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`

  else if (file.endsWith('.jpg') || file.endsWith('.jpeg'))
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`

  else if (file.endsWith('.png'))
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`

  return ''
}

const renderPreloadLinks = (modules: string[], manifest: Record<string, string[]>): string => {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file: string) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = file.split('/').pop() as string
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

export const handler: ServerHandler = async (App, options, hook?) => async (renderOptions) => {
  const { skipRender = false, url, manifest, req, res } = renderOptions

  const sharedServerOptions: SharedServerOptions = {
    isClient: false,
    ...options,
    ...renderOptions,
  }
  if (skipRender)
    return sharedServerOptions

  const { app, router, head, directus, storage } = await createApp(App, sharedServerOptions)

  const refreshToken = getCookieValue(req, renderOptions.env.REFRESH_TOKEN_COOKIE_NAME)
  if (refreshToken) {
    await directus.setRefreshToken(refreshToken)
    try {
      const authData = await directus.refresh()

      res.cookie(renderOptions.env.REFRESH_TOKEN_COOKIE_NAME, authData.refresh_token, {
        httpOnly: true,
        domain: renderOptions.env.REFRESH_TOKEN_COOKIE_DOMAIN as string,
        maxAge: authData.expires as number,
        secure: (renderOptions.env.REFRESH_TOKEN_COOKIE_SECURE as boolean) ?? false,
        sameSite: (renderOptions.env.REFRESH_TOKEN_COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'strict',
      })
    }
    catch (error: any) {
      res.clearCookie(renderOptions.env.REFRESH_TOKEN_COOKIE_NAME)
    }

    // Object.assign(sharedServerOptions.initialState || {}, { refresh_token: authData.refresh_token })
  }

  hook && await hook({
    app,
    router,
    directus,
    storage,
    head,
    initialState: sharedServerOptions.initialState,
    isClient: sharedServerOptions.isClient,
    options: sharedServerOptions,
  })

  app.use(router)
  router.push(url)

  await router.isReady()

  const ctx: any = {}
  const appHtml = await renderToString(app, ctx)
  const appParts = await renderSSRHead(head)
  const preloadedLinks = renderPreloadLinks(ctx.modules, manifest)

  Object.assign(
    sharedServerOptions.initialState || {},
    { routeState: (router.currentRoute.value.meta || {}).state || {} },
  )

  return {
    appHtml,
    preloadedLinks,
    initialState: sharedServerOptions.initialState,
    appParts,
    directus,
  }
}
