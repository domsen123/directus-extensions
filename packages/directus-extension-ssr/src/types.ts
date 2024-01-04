import type { AuthenticationClient, AuthenticationData, DirectusClient, GraphqlClient, GraphqlConfig, RestClient, RestConfig, WebSocketClient, WebSocketConfig } from '@directus/sdk'
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
  initialState: InitialState
}

export type SharedServerOptions = {
  isClient: false
} & UserOptions & RenderOptions

export type SharedClientOptions = {
  isClient: true
  initialState: InitialState
} & UserOptions

export type SharedHandler = (App: Component, options: SharedServerOptions | SharedClientOptions, hook?: (ctx: AppClientContext | AppServerContext) => Promise<void>) => Promise<SharedResult>

export type ClientHandler = (App: Component, options: UserOptions, hook?: (ctx: AppClientContext) => Promise<void>) => Promise<void>

export type ServerHandler = (App: Component, options: UserOptions, hook?: (ctx: AppServerContext) => Promise<void>) => Promise<RenderFn>

type RouterOptions = Omit<Router['options'], 'history'>
export interface UserOptions {
  routerOptions: RouterOptions
  directusOptions?: {
    restConfig?: (ctx: SharedServerOptions | SharedClientOptions) => Partial<RestConfig> | undefined
    graphqlConfig?: (ctx: SharedServerOptions | SharedClientOptions) => Partial<GraphqlConfig> | undefined
    webSocketConfig?: (ctx: SharedServerOptions | SharedClientOptions) => Partial<WebSocketConfig> | undefined
  }
}
export type UserHandler = (App: Component, options: UserOptions, hook?: (ctx: AppClientContext | AppServerContext) => Promise<void>) => Promise<void | RenderFn>

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
  initialState: InitialState
  isClient: boolean
}

export type AppClientContext = {
  isClient: true
  options: SharedClientOptions
} & AppContext

export type AppServerContext = {
  isClient: false
  options: SharedServerOptions
} & AppContext

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
