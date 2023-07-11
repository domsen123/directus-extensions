import path from 'node:path'
import { readFileSync } from 'node:fs'
import { defineHook } from '@directus/extensions-sdk'
import { static as serveStatic } from 'express'
import devalue from '@nuxt/devalue'
import type { Application } from 'express'
import type { ViteDevServer } from 'vite'
import directusSSR from 'directus-extension-ssr/plugin'
import type { InitialState, RenderFn, RenderResult } from '../types'

export const config = defineHook(async ({ init }, { env }) => {
  init('routes.custom.after', async (ctx) => {
    const app: Application = ctx.app
    const isDev = env.SSR_ENV === 'development'

    const resolve = (p: string) => path.resolve(process.cwd(), p)

    const indexProd = isDev ? '' : readFileSync(resolve('dist/client/index.html'), 'utf-8')
    const manifest = isDev ? {} : JSON.parse(readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8'))

    let vite: ViteDevServer
    if (isDev) {
      vite = await (await import('vite')).createServer({
        root: process.cwd(),
        server: {
          middlewareMode: true,
        },
        plugins: [
          directusSSR(),
        ],
        appType: 'custom',
      })
      app.use(vite.middlewares)
    }
    else {
      app.use(serveStatic(resolve('dist/client'), { index: false }))
    }

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl

        let template: string
        let render: RenderFn

        if (isDev) {
          template = readFileSync(resolve('index.html'), 'utf-8')
          template = await vite.transformIndexHtml(url, template)
          render = await (await vite.ssrLoadModule('/src/main.ts')).default
        }
        else {
          template = indexProd
          render = await (await import(resolve('dist/server/main.mjs'))).default
        }
        const initialState: InitialState = {
          access_token: null,
        }

        const {
          appHtml,
          preloadedLinks,
          appParts: { headTags, htmlAttrs, bodyAttrs, bodyTags },
          directus,
        } = await render({
          skipRender: false,
          url,
          manifest,
          initialState,
          req,
          res,
          env,
        }) as RenderResult

        const state = {
          ...initialState,
          access_token: directus ? directus.storage.get('auth_token') : null,
        }
        const __INITIAL_STATE__ = `  <script>window.__INITIAL_STATE__ = ${devalue(state)}</script>`

        const html = template
          .replace('<html', `<html ${htmlAttrs}`)
          .replace('<!--preload-links-->', `${preloadedLinks}\n${headTags}`)
          .replace('<!--app-html-->', appHtml)
          .replace('<body', `<body ${bodyAttrs}`)
          .replace('</body>', `${bodyTags}\n${__INITIAL_STATE__}\n</body>`)

        res.removeHeader('Content-Security-Policy')
        res.status(200).set({
          'Content-Type': 'text/html',
        }).end(html)
      }
      catch (error: any) {
        vite && vite.ssrFixStacktrace(error)
        console.error(error)
        res.status(500).send(error.stack)
      }
    })
  })
})
