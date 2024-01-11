import type { PiniaPluginContext } from 'pinia'
import type { AppContext } from '../types'
import { isClient, isServer } from './isEnv'

export const directusSSRPlugin = ({ store, pinia }: PiniaPluginContext, ctx: AppContext) => {
  store.$directus = ctx.directus

  if (isClient(ctx))
    pinia.state.value = (ctx.initialState.pinia) || {}
  if (isServer(ctx)) {
    ctx.initialState.pinia = pinia.state.value
    Reflect.deleteProperty(ctx.initialState.pinia, '_request_')
  }
}
