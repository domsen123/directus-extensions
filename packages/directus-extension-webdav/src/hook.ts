import { v2 as webdav } from 'webdav-server'
import { defineHook } from '@directus/extensions-sdk'
import type { HookConfig } from '@directus/types'
import type { Application } from 'express'

class DirectusFileSystemSerializer implements webdav.FileSystemSerializer {
  uid(): string {
    return 'WebFileSystemSerializer_1.0.0'
  }

  serialize(fs: DirectusFileSystem, callback: webdav.ReturnCallback<any>): void {
    callback(undefined, {
      url: '/webdav/test.txt',
      props: fs.props,
    })
  }

  unserialize(serializedData: any, callback: webdav.ReturnCallback<DirectusFileSystem>): void {
    const fs = new DirectusFileSystem()
    fs.props = new webdav.LocalPropertyManager(serializedData.props)
    callback(undefined, fs)
  }
}

class DirectusFileSystem extends webdav.FileSystem {
  props: webdav.IPropertyManager
  locks: webdav.ILockManager

  constructor() {
    super(new DirectusFileSystemSerializer())
    this.props = new webdav.LocalPropertyManager()
    this.locks = new webdav.LocalLockManager()
  }

  _fastExistCheck(ctx: webdav.RequestContext, path: webdav.Path, callback: (exists: boolean) => void): void {
    callback(path.isRoot())
    // const query: Query = {
    //   limit: -1,
    // }
    // this.ItemService.readByQuery(query).then((items: any[]) => {
    //   console.log(items)
    //   callback(true)
    // })
  }

  _propertyManager(path: webdav.Path, ctx: webdav.PropertyManagerInfo, callback: webdav.ReturnCallback<webdav.IPropertyManager>): void {
    console.log('_propertyManager', path)
    callback(undefined, this.props)
  }

  _lockManager(path: webdav.Path, ctx: webdav.LockManagerInfo, callback: webdav.ReturnCallback<webdav.ILockManager>): void {
    console.log('_lockManager', path)
    callback(undefined, this.locks)
  }

  _type(path: webdav.Path, info: webdav.TypeInfo, callback: webdav.ReturnCallback<webdav.ResourceType>): void {
    console.log('_type', path)
    callback(undefined, webdav.ResourceType.File)
  }

  readDir(ctx: webdav.RequestContext, path: webdav.Path, callback: webdav.ReturnCallback<string[]>): void {
    callback(undefined, ['test.txt'])
  }
}

export const config: HookConfig = defineHook(async ({ init }, { services, getSchema, database }) => {
  const { ItemsService } = services
  init('routes.custom.after', async (ctx) => {
    const app: Application = ctx.app

    const schema = await getSchema()

    const itemService = new ItemsService('directus_files', { schema, knex: database })
    const server = new webdav.WebDAVServer({
      rootFileSystem: new DirectusFileSystem(),
    })

    app.use(webdav.extensions.express('/webdav', server))
  })
})
