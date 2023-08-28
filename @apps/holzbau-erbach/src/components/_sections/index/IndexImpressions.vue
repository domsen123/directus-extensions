<script lang="ts" setup>
import { readItems } from '@directus/sdk'
import type { AppDirectusClient } from 'directus-extension-ssr/types'
import DotsLightBackground from '~/assets/images/bg_dots_light.png'

const store = useMainStore()
const directus = inject('directus') as AppDirectusClient
const items = ref<any[]>([])

const onInit = async () => {
  if (store.getItemsByCollection('projects').value.length)
    return items.value = store.getItemsByCollection('projects').value.slice(0, 3)
  try {
    const result = await directus.request(readItems('projects', {
      fields: ['id', 'title', 'teaser', 'url', 'gallerie.directus_files_id.id'],
      sort: '-date_created',
      limit: 3,
    })) as any[]

    items.value = result
    store.setItems(result, 'projects')
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
          <div class="text-uppercase" v-text="`Unsere Arbeit`" />
        </div>
        <h2 class="mb-16 text-4xl tracking-wide uppercase">
          <span class="font-bold">Impressionen</span> unserer Arbeit
        </h2>

        <div class="flex flex-col gap-3">
          <router-link v-for="project in items" :key="project.id" :to="`/projekte/${project.url}`" class="group flex flex-col gap-4 border border-dotted p-2 transition ease-in md:flex-row hover:(scale-103 border-primary shadow-lg)">
            <div
              class="h-30 w-full flex-shrink-0 bg-blue-gray-100 bg-cover bg-center transition ease-in md:(aspect-1 h-auto max-w-50 flex-row) group-hover:(scale-115)"
              :style="{ backgroundImage: project.gallerie.length >= 1 ? `url(/assets/${project.gallerie[0].directus_files_id.id}?width=300&height=300&fit=cover&quality=80)` : undefined }"
            />
            <div class="flex flex-col items-start p-2 transition ease-in group-hover:md:(translate-x-3)">
              <h2 class="mb-4 text-2xl font-bold" v-text="project.title" />
              <p v-text="project.teaser" />

              <v-btn class="mt-4 flex self-end md:hidden" color="primary">
                Mehr erfahren
              </v-btn>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
