<p align="center">
  <img width="180" src="https://github.com/domsen123/directus-extension-ssr/blob/main/img/directus-ssr.png?raw=true" alt="Directus Extension SSR logo">
</p>
<br/>

# Directus SSR 🐰 ⚡
Render your Vite Application next to Directus with zero config.

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

export default handler(App, {
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue'),
    },
  ],
})
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

# Dev
You can set the environment variable `SSR_ENV`  to "development" through your directus .env / config.js / config.ts file or via cli
```bash
SSR_ENV=development npx directus start
```

# Build
Like in any other vite-ssr project, extend your `package.json` with the following `vite build scripts`:

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
easy as hell