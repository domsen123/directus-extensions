<script lang="ts" setup>
import type { SSRDirectusClient } from 'directus-extension-ssr/types'
import { useServerState } from 'directus-extension-ssr/utils'
import { ItemService } from 'directus-extension-ssr/services'
import type { ISchema } from '~/interfaces'

const directus = inject('directus') as SSRDirectusClient<ISchema>

const itemService = new ItemService(directus)

const query = ref({
  fields: ['uuid', 'name', 'date_updated'],
  limit: 3,
})

const { state, errors } = useServerState({
  item: itemService.readItem('test_collection', '04806951-1fb3-40f6-9e6f-a4ec970e578a', {
    fields: ['uuid', 'name', 'date_updated'],
  }),
  items: itemService.queryItems('test_collection', 'uuid', query),
})

const onChangeQueryClick = () => {
  if (query.value.limit === 10) {
    query.value = {
      ...query.value,
      limit: 3,
    }
    return
  }

  query.value = {
    ...query.value,
    limit: query.value.limit + 1,
  }

  console.log('query.value', query.value.limit)
}
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
    </router-link><br>
    <button type="button" @click="onChangeQueryClick">
      Change Query
    </button>
  </div>
</template>

<style></style>
