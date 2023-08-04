<p align="center">
  <img width="180" src="https://raw.githubusercontent.com/domsen123/directus-extension-ssr/main/examples/app/src/assets/img/directus-ssr.png" alt="Directus Extension SSR logo">
</p>
<br/>

# Directus SSR 🐰 ⚡
Render your Vite Application next to Directus: easy as hell.

`directus-extension-ssr@^2.0.0` => @directus/sdk@^11.0.0\
`directus-extension-ssr@1.0.11` => @directus/sdk@^10.3.0

# Installation
Install `directus-extension-ssr` into your self-hosted [directus](https://directus.io/) instance.
```bash
cd /path/to/your/directus/installation
npm install directus-extension-ssr
```

# Setup Vite Project
### FIRST STEP
Setup your vite project like you normaly do. (Directly in your directus self-hosted project).\
But your ```src/main.ts``` file should look similar like this:

```js
import { handler } from 'directus-extension-ssr'
import App from './App.vue'

export default handler(App,
  {
    routerType: 'vue-router', // or 'unplugin-vue-router'
    routerOptions: {
      routes: [
        { path: '/', component: () => import('./pages/Home.vue') },
        { path: '/about', component: () => import('./pages/About.vue') },
      ],
      // extendRoutes: () => setupLayouts(routes) => if you want to use 'unplugin-vue-router' with 'vite-plugin-vue-layouts'! But don not forget pnpm i -D vite-plugin-vue-layouts
    }
  },
  async (ctx) => {
    // Add your custom logic here
    // register pinia for example
    // register vuetify
    // do what ever you want
  },
)
```
### SECOND STEP
Next add DirectusSSR in vite.config.ts as a plugin.

```js
import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DirectusSSR from 'directus-extension-ssr/plugin'

export default defineConfig({
  [...]
  plugins: [
    [...]
    DirectusSSR(),
    [...]
  ],
  [...]
})
```
### THIRD STEP
Disable directus `ROOT_REDIRECT` through your directus .env / config.js / config.ts whatever

```env
[...]
ROOT_REDIRECT=false
[...]
```

### FOURTH STEP
Be sure, that your index.html includes the following COMMENTS (--app-html-- and --preload-links--) exactly as shown below:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!--preload-links-->
</head>
<body>
  <div id="app"><!--app-html--></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```
# Inject Directus

Just use `inject('directus')` anywhere in setup function.

# Pinia
If you want to use Pinia, do something like that:

```js
// src/modules/pinia.ts
export const install: UserModule = ({ isClient, initialState, directus, app }) => {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    store.directus = directus
  })

  app.use(pinia)

  if (isClient)
    pinia.state.value = (initialState.pinia) || {}

  else initialState.pinia = pinia.state.value
}

// src/pinia.d.ts
declare module 'pinia' {
  export interface PiniaCustomProperties {
    directus: import('directus-extension-ssr/types').AppDirectusClient
  }
}

// src/main.ts
export default handler(App,
  {
    routerType: 'vue-router',
    routerOptions: {
      routes: [
        { path: '/', component: () => import('./pages/Home.vue') }
      ],
    }
  },
  async (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob < { install: UserModule } > ('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)

// stores/user.ts
export const useUser = defineStore('user', {
  state: () => ({
    currentUser: null,
  }) as { currentUser: any },
  actions: {
    async fetchCurrentUser() {
      if (this.$state.currentUser) return
      try {
        const currentUser = await this.directus.request(readMe({ fields: ['first_name'] }))
        this.$state.currentUser = currentUser
      }
      catch (e: any) {
        console.error(e.message)
      }
    },
  },
})
```

# Dev
You can set the environment variable `SSR_ENV`  to "development" through your directus .env / config.js / config.ts file or via cli.\
Have fun with HMR 🔥

```bash
SSR_ENV=development npx directus start
```

# Build
Like in any other vite ssr project, extend your `package.json` with the following `vite build scripts`:

```json
"scripts": {
  [...]
  "build": "pnpm run build:client && pnpm run build:server",
  "build:client": "vite build --outDir dist/client --ssrManifest",
  "build:server": "vite build --outDir dist/server --ssr src/main.ts"
  [...]
}
```

# Prod
after build - run: 
```
npx directus start
```
easy as hell 😈


# Try it 

Check out: examples/app

```bash
git clone git@github.com:domsen123/directus-extension-ssr.git
cd directus-extension-ssr
pnpm build && pnpm app:bootstrap
```
dev mode:
```bash
pnpm app:dev
```

prod mode:
```bash
pnpm app:build && pnpm app:start
```

Got to example application: [Application](http://localhost:8055)\
Go to directus admin dashboard: [Directus Dashboard](http://localhost:8055/admin)
