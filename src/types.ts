import type { Directus, IAuth, TypeMap } from '@directus/sdk'
import type { HeadClient } from '@vueuse/head'
import type { Request, Response } from 'express'
import type { App, Component, InjectionKey } from 'vue'
import type { RouteRecordRaw, Router } from 'vue-router'

export type Lazy<T> = () => Promise<T>

type AnyItem = Record<string, any>

export interface InitialState extends AnyItem {
  access_token: string | null
}
export interface SharedResult {
  app: App
  router: Router
  directus: AppDirectus
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
  layouts?: LayoutRecordRaw[]
  components?: ComponentRecordRaw[]
}
export type UserHandler = (App: Component, options: UserOptions, hook?: (ctx: AppContext) => Promise<void>) => Promise<void | RenderFn>

export interface AppTypeMap extends TypeMap {}
export type AppDirectus = Directus<AppTypeMap, IAuth>

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
  directus: AppDirectus
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
  directus: AppDirectus
  isClient: boolean
  initialState: InitialState
}

export const InjectDirectus: InjectionKey<AppDirectus> = Symbol('Directus')
