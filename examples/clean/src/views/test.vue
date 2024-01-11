<script lang="ts" setup>
import type { SSRDirectusClient } from 'directus-extension-ssr/types'
import { useServerState } from 'directus-extension-ssr/utils'
import { ItemService } from 'directus-extension-ssr/services'
import type { ISchema } from '~/interfaces'

const directus = inject('directus') as SSRDirectusClient<ISchema>

const itemService = new ItemService(directus, 'uuid')

const { state, errors } = useServerState({
  item: async () => await itemService.readItem('test_collection', '04806951-1fb3-40f6-9e6f-a4ec970e578a', {
    fields: ['uuid', 'name', 'date_updated'],
  }),
  items: async () => await itemService.queryItems('test_collection', {
    fields: ['uuid', 'name', 'date_updated'],
    limit: 3,
  }),
})
</script>

<template>
  <div>
    <!-- <ul>
      <li v-for="item in state.items" :key="item.uuid">
        {{ item.name }}
      </li>
    </ul>
    <pre v-text="{ loading, hasError: hasError('items').value, ...state }" /> -->
    <pre v-text="{ state, errors }" />
    <router-link to="/">
      Home
    </router-link>
  </div>
</template>

<style></style>
