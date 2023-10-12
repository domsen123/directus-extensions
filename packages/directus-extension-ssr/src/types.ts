import type { AuthenticationClient, AuthenticationData, DirectusClient, GraphqlClient, RestClient, WebSocketClient } from '@directus/sdk'
import type { VueHeadClient } from '@unhead/vue'
import type { Request, Response } from 'express'
import type { App, Component, InjectionKey } from 'vue'
import type { Router } from 'vue-router'

export type Lazy<T> = () => Promise<T>

type AnyItem = Record<string, any>

export interface InitialState extends AnyItem {
  access_token: string | null
  refresh_token: string | null
}
export interface SharedResult {
  app: App
  router: Router
  directus: AppDirectusClient
  head: VueHeadClient<NonNullable<unknown>>
}

export type SharedServerOptions = {
  isClient: false
} & UserOptions & RenderOptions

export type SharedClientOptions = {
  isClient: true
  initialState: InitialState
} & UserOptions

export type SharedHandler = (App: Component, options: SharedServerOptions | SharedClientOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<SharedResult>

export type ClientHandler = (App: Component, options: UserOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<void>

export type ServerHandler = (App: Component, options: UserOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<RenderFn>

interface RouterOptions extends Omit<Router['options'], 'history' | 'routes'> {
  routes?: Router['options']['routes']
  extendRoutes?: (routes?: Router['options']['routes']) => Router['options']['routes']
}
export interface UserOptions {
  routerType?: 'vue-router' | 'unplugin-vue-router'
  routerOptions: RouterOptions
}
export type UserHandler = (App: Component, options: UserOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<void | RenderFn>

export interface DirectusSchema extends Record<string | number | symbol, unknown> {
}

export interface ExtendedAuthenticationClient extends AuthenticationClient<DirectusSchema> {
  setCredentials: (data: AuthenticationData) => void
  getCredentials: () => Promise<AuthenticationData | null>
  setRefreshToken: (refresh_token: string | null) => Promise<void>
  setToken: (access_token: string | null) => Promise<void>
}

export type AppDirectusClient = DirectusClient<DirectusSchema>
& AuthenticationClient<DirectusSchema>
& RestClient<DirectusSchema>
& GraphqlClient<DirectusSchema>
& WebSocketClient<DirectusSchema>

export type RenderFn = (options: RenderOptions) => Promise<RenderResult | SharedServerOptions>
export interface RenderOptions {
  skipRender?: boolean
  url: string
  manifest: Record<string, string[]>
  initialState: InitialState
  req: Request
  res: Response
  env: Record<string, any>
}
export interface RenderResult {
  appHtml: string
  preloadedLinks: string
  appParts: { headTags: string; htmlAttrs: string; bodyAttrs: string; bodyTags: string }
  directus: AppDirectusClient
}

export interface LayoutRecordRaw {
  name: string
  component: Component | Lazy<Component>
}

export interface ComponentRecordProps {
  title: string
  name: string
  type: string
  required?: boolean
}

export interface ComponentRecordRaw {
  name: string
  component: Component | Lazy<Component>
  props?: ComponentRecordProps[]
}

export interface AppContext {
  app: App
  router: Router
  directus: AppDirectusClient
  isClient: boolean
  initialState: InitialState
}

export const InjectDirectus: InjectionKey<DirectusClient<DirectusSchema>> = Symbol('Directus')

export interface DirectusAssetTransformations {
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
  width?: number
  height?: number
  quality?: number
  withoutEnlargement?: boolean
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'tiff' | 'avif'
  transforms?: any[][]
}

export interface CurrentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  avatar: string
}
