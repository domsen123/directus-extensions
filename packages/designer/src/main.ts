import 'vuetify/styles'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Designer from './Designer.vue'

import 'uno.css'

const app = createApp(Designer)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/index.vue') },
  ],
})

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaults: {
      VBtn: {
        class: 'text-overline font-weight-bold',
      },
    },
  },
})

app.use(router).use(vuetify)

router.isReady().then(() => {
  app.mount('#app')
})
