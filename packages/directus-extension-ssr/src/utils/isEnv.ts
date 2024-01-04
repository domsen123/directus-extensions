import type { AppClientContext, AppServerContext } from '~/types'

export const isClient = (ctx: AppClientContext | AppServerContext): ctx is AppClientContext => ctx.isClient
export const isServer = (ctx: AppClientContext | AppServerContext): ctx is AppServerContext => !ctx.isClient
