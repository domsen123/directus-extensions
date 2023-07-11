import { handler } from 'directus-extension-ssr'
import App from './App.vue'

export default handler(App,
  {
    routes: [
      { path: '/', component: () => import('./pages/Home.vue') },
      { path: '/about', component: () => import('./pages/About.vue') },
    ],
  },
)
