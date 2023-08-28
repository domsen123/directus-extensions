<script lang="ts" setup>
import { readItems } from '@directus/sdk'
import type { AppDirectusClient } from 'directus-extension-ssr/types'

const props = defineProps({
  url: { type: String, required: true },
})
const directus = inject('directus') as AppDirectusClient
const item = ref<any>(null)

useHead({
  title: () => item.title,
  meta: [
    { name: 'description', content: () => item.teaser },
  ],
})

const onInit = async () => {
  try {
    const result = await directus.request(readItems('projects', {
      filter: {
        url: { _eq: props.url },
      },
      fields: ['id', 'title', 'teaser', 'content', 'gallerie.directus_files_id.id'],
      sort: '-date_created',
      limit: 1,
    }))
    item.value = result.length === 1 ? result[0] : null
  }
  catch (error: any) {

  }
}

onMounted(onInit)
onServerPrefetch(async () => await onInit())
</script>

<template>
  <title-page v-if="item" :title="item.title">
    <div class="py-16 prose container">
      <div class="border bg-gray-50 p-4">
        <section class="font-bold" v-text="item.teaser"></section>
        <section v-html="item.content"></section>
      </div>
    </div>
  </title-page>
</template>

<style></style>
