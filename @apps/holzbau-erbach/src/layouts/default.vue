<script lang="ts" setup>
import { NAVIGATION_ITEMS } from '~/constants'

const store = useMainStore()
const company = store.getItemByCollection('info_company')

const scrollToTop = () => {
  console.log('drin')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <nav-bar />
    <main>
      <router-view />
    </main>
    <footer class="bg-white py-15 md:pt-15">
      <div class="container">
        <div class="grid grid-cols-1 gap-12 text-zinc-900 lg:grid-cols-4 md:grid-cols-2">
          <div>
            <div class="mb-10 font-bold">
              <logo width="200" />
            </div>
            <div class="flex gap-1">
              <a v-if="company?.facebook" :href="company?.facebook" target="_blank" class="block h-14 w-14 flex items-center justify-center border rounded-full">
                <div class="i-bx-bxl-facebook h-8 w-8" />
              </a>
              <a v-if="company?.instagram" :href="company?.instagram" target="_blank" class="block h-14 w-14 flex items-center justify-center border rounded-full">
                <div class="i-bx-bxl-instagram h-8 w-8" />
              </a>
            </div>
          </div>
          <div>
            <div class="mb-8 flex items-center">
              <span class="mr-8 bg-zinc-1 px-3 py-1 uppercase text-zinc-900">Navigation</span>
              <div class="h-1px w-25 bg-zinc-200" />
            </div>
            <ul>
              <li v-for="{ text, to } in NAVIGATION_ITEMS" :key="to">
                <router-link :to="to">
                  {{ text }}
                </router-link>
              </li>
              <li>
                <router-link to="/impressum">
                  Impressum
                </router-link>
              </li>
              <li>
                <router-link to="/datenschutz">
                  Datenschutz
                </router-link>
              </li>

              <li>
                <a href="/admin">
                  Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div class="mb-8 flex items-center">
              <span class="mr-8 bg-zinc-1 px-3 py-1 uppercase text-zinc-900">Kontakt</span>
              <div class="h-1px w-25 bg-zinc-200" />
            </div>
            <a v-if="company?.phone" :href="`tel:${company?.phone}`" class="mb-3 block text-sm text-zinc-900">
              <span class="font-bold text-black">T:</span> {{ company?.phone }}
            </a>
            <a v-if="company?.fax" class="mb-3 block text-sm text-zinc-900">
              <span class="font-bold text-black">F:</span> {{ company?.fax }}
            </a>
            <a v-if="company?.mail" :href="`mailto:${company?.mail}`" class="mb-3 block text-sm text-zinc-900">
              <span class="font-bold text-black">E:</span> {{ company?.mail }}
            </a>
          </div>
          <div>
            <div class="mb-8 flex items-center">
              <span class="mr-8 bg-zinc-1 px-3 py-1 uppercase text-zinc-900">Adresse</span>
              <div class="h-1px w-25 bg-zinc-200" />
            </div>
            <address class="text-sm text-zinc-900">
              <span class="font-semibold">{{ company?.name }}</span><br />
              {{ company?.street }} {{ company?.house_no }} <br />
              {{ company?.postcode }} {{ company?.city }}
            </address>
          </div>
        </div>
      </div>
    </footer>
    <v-btn class="fixed bottom-10 right-10 shadow-xl" color="primary" size="lg" icon="i-solar:alt-arrow-up-line-duotone" icon-only @click="scrollToTop" />
  </div>
</template>
