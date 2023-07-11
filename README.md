<p align="center">
  <img width="180" src="https://raw.githubusercontent.com/domsen123/directus-extension-ssr/main/examples/app/src/assets/img/directus-ssr.png" alt="Directus Extension SSR logo">
</p>
<br/>

# Directus SSR 🐰 ⚡
Render your Vite Application next to Directus: easy as hell.

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
    routes: [
      { path: '/', component: () => import('./pages/Home.vue') },
      { path: '/about', component: () => import('./pages/About.vue') },
    ],
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