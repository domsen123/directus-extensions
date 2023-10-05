import { renderToString } from 'vue/server-renderer'
import { renderSSRHead } from '@unhead/ssr'
import type { ServerHandler, SharedServerOptions } from '../types'
import { createApp } from './entry-shared'

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
  const { skipRender = false, url, manifest, initialState } = renderOptions

  const sharedServerOptions: SharedServerOptions = {
    isClient: false,
    ...options,
    ...renderOptions,
  }
  if (skipRender) return sharedServerOptions

  const {
    app,
    router,
    head,
    directus,
  } = await createApp(App, sharedServerOptions, hook)

  app.use(router)
  router.push(url)

  await router.isReady()

  const ctx: any = {}
  const appHtml = await renderToString(app, ctx)
  const appParts = await renderSSRHead(head)
  const preloadedLinks = renderPreloadLinks(ctx.modules, manifest)

  Object.assign(
    initialState || {},
    { routeState: (router.currentRoute.value.meta || {}).state || {} },
  )

  return {
    appHtml,
    preloadedLinks,
    initialState,
    appParts,
    directus,
  }
}
