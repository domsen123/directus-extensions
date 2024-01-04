import type { Plugin, UserConfig } from 'vite'

export default (): Plugin => {
  const name = 'directus-extension-ssr'
  const virtualModuleId = `virtual:${name}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  return {
    name,
    enforce: 'pre',
    config(config) {
      const cfg: Omit<UserConfig, 'plugins'> = {
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

      if (!config.build?.ssr) {
        cfg.build = {
          ...cfg.build ?? {},
          ssrManifest: 'ssr-manifest.json',
        }
      }

      return cfg
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
