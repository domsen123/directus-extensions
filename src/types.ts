import type { AuthenticationClient, AuthenticationData, DirectusClient, GraphqlClient, RestClient, WebSocketClient } from '@directus/sdk'
import type { HeadClient } from '@vueuse/head'
import type { Request, Response } from 'express'
import type { App, Component, InjectionKey } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export type Lazy<T> = () => Promise<T>

type AnyItem = Record<string, any>

export interface InitialState extends AnyItem {
  access_token: string | null
  directusCredentials: AuthenticationData | null
}
export interface SharedResult {
  app: App
  router: Router
  directus: AppDirectusClient
  head: HeadClient<NonNullable<unknown>>
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

export interface UserOptions {
  routes: RouteRecordRaw[]
  scrollBehavior?: Router['options']['scrollBehavior']
}
export type UserHandler = (App: Component, options: UserOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<void | RenderFn>

export interface ExtendedAuthenticationClient extends AuthenticationClient<DirectusSchema> {
  setCredentials: (data: AuthenticationData) => void
  getCredentials: () => Promise<AuthenticationData>
  setRefreshToken: (refresh_token: string | null) => Promise<void>
  setToken: (access_token: string | null) => Promise<void>
}

type Schema = object

export interface DirectusSchema extends Schema {}
export type AppDirectusClient = DirectusClient<DirectusSchema> & ExtendedAuthenticationClient & RestClient<DirectusSchema> & GraphqlClient<DirectusSchema> & WebSocketClient<DirectusSchema>

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
