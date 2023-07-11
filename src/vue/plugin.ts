import type { Plugin } from 'vite'

export default (): Plugin => {
  const name = 'directus-extension-ssr'
  const virtualModuleId = `virtual:${name}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  return {
    name,
    enforce: 'pre',
    config() {
      return {
        ssr: {
          noExternal: [
            'directus-extension-ssr',
          ],
        },
        build: {
          assetsDir: '$assets',
          target: 'esnext',
        },
      }
    },
    resolveId(source) {
      if (source === 'directus-extension-ssr')
        return resolvedVirtualModuleId
    },
    load(id, options) {
      if (id === resolvedVirtualModuleId) {
        const path = options?.ssr ? `${name}/entry-server` : `${name}/entry-client`
        return `export { handler } from '${path}'`
      }
    },
  }
}
