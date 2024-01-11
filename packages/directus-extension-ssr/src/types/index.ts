type AnyItem = Record<string, any>

export interface InitialState extends AnyItem {
  refresh_token: string | null
}

export interface UserOptions {
  routerOptions: Omit<import('vue-router').RouterOptions, 'history'>
  debug?: number
}

export interface RenderOptions {
  skipRender?: boolean
  url: string
  manifest: Record<string, string[]>
  initialState: InitialState
  req: import('express').Request
  res: import('express').Response
  env: Record<string, any>
}

export interface SSRExtension<_Schema extends object> {
  setAccessToken: (access_token: string | null) => Promise<void>
  setRefreshToken: (refresh_token: string | null) => Promise<void>
  setAuthData: (data: import('@directus/sdk').AuthenticationData) => Promise<void>
}

export type SSRDirectusClient<_Schema extends object = object> = import('@directus/sdk').DirectusClient<_Schema>
  & import('@directus/sdk').AuthenticationClient<_Schema>
  & import('@directus/sdk').RestClient<_Schema>
  & import('@directus/sdk').GraphqlClient<_Schema>
  & import('@directus/sdk').WebSocketClient<_Schema>
  & SSRExtension<_Schema>

export interface RenderResult {
  appHtml: string
  preloadedLinks: string
  appParts: { headTags: string, htmlAttrs: string, bodyAttrs: string, bodyTags: string }
  directus: SSRDirectusClient
}

export interface SharedResult {
  app: import('vue').App
  router: import('vue-router').Router
  directus: SSRDirectusClient
  storage: import('@directus/sdk').AuthenticationStorage
  head: import('@unhead/vue').VueHeadClient<import('@unhead/vue').MergeHead>
}

export type AppServerContext = {
  isClient: false
  options: SharedServerOptions
  initialState: InitialState
} & SharedResult

export type AppClientContext = {
  isClient: true
  options: SharedClientOptions
  initialState: InitialState
} & SharedResult

export type AppContext = SharedResult & (AppServerContext | AppClientContext)

export type SharedServerOptions = {
  isClient: false
} & UserOptions & RenderOptions

export type SharedClientOptions = {
  isClient: true
  initialState: InitialState
} & UserOptions

export type SharedHandler = (App: import('vue').Component, options: SharedServerOptions | SharedClientOptions) => Promise<SharedResult>

export type RenderFn = (options: RenderOptions) => Promise<RenderResult | SharedServerOptions>
export type ServerHandler = (App: import('vue').Component, options: UserOptions, hook?: (ctx: AppServerContext) => Promise<void>) => Promise<RenderFn>
export type ClientHandler = (App: import('vue').Component, options: UserOptions, hook?: (ctx: AppClientContext) => Promise<void>) => Promise<void>

export type HookConfig = ReturnType<typeof import('@directus/extensions-sdk').defineHook>
