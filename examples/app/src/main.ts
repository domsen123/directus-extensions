import { handler } from 'directus-extension-ssr'
import App from './App.vue'

export default handler(App, {
  routes: [
    {
      path: '/',
      component: () => import('./Home.vue'),
    },
  ],
})
