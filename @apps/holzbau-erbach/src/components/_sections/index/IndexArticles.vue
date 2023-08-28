<script lang="ts" setup>
import { readItems } from '@directus/sdk'
import type { AppDirectusClient } from 'directus-extension-ssr/types'
import dayjs from 'dayjs'
import DotsLightBackground from '~/assets/images/bg_dots_light.png'

const directus = inject('directus') as AppDirectusClient
const items = ref<any[]>([])

const onInit = async () => {
  try {
    const result = await directus.request(readItems('articles', {
      fields: ['id', 'title', 'url', 'teaser', 'picture'],
      sort: '-date_created',
      limit: 3,
    }))
    items.value = result
    route.meta.state = result
  }
  catch (error: any) {

  }
}

onMounted(onInit)
onServerPrefetch(async () => await onInit())
</script>

<template>
  <section class="bg-white pt-15 md:pt-15" :style="{ backgroundImage: `url(${DotsLightBackground})` }">
    <div class="py-8 container md:py-32">
      <div class="flex flex-col">
        <div class="flex items-center gap-2 xl:text-xl">
          <div class="h-4 w-1 bg-primary -skew-x-8" />
          <div class="text-uppercase" v-text="`Wissenswertes`" />
        </div>
        <h2 class="mb-4 text-4xl tracking-wide uppercase md:mb-16">
          Unsere letzten <span class="font-bold">Artikel</span>
        </h2>

        <div class="flex flex-col gap-3 md:flex-row">
          <router-link v-for="(article) in items" :key="article.id" :to="`/artikel/${article.url}`" class="group flex flex-1 flex-col gap-8 border border-dotted p-2 transition ease-in hover:(scale-102 border-primary shadow-lg)">
            <div
              class="h-30 w-full flex-shrink-0 bg-blue-gray-100 bg-cover bg-center transition ease-in md:(aspect-1 h-auto) group-hover:(scale-108 shadow-xl)"
              :style="{ backgroundImage: article.picture ? `url(/assets/${article.picture}?width=300&height=300&fit=cover&quality=80)` : undefined }"
            />
            <div class="flex flex-col items-start p-2">
              <div class="mb-0 text-sm font-semibold text-blue-gray-400">
                {{ dayjs(article.date_created).format('DD.MM.YYYY') }}
              </div>
              <h2 class="mb-4 text-2xl font-bold" v-text="article.title" />
              <p v-text="article.teaser" />

              <v-btn class="mt-4 flex self-end md:hidden" color="primary">
                Weiterlesen
              </v-btn>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
