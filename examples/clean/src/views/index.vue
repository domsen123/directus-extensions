<script lang="ts" setup>
import { useServerState } from 'directus-extension-ssr/utils'
import type { SSRDirectusClient } from 'directus-extension-ssr/types'
import { readMe } from '@directus/sdk'
import type { ISchema } from '~/interfaces'

const directus = inject('directus') as SSRDirectusClient<ISchema>

const fetchCurrentUser = async () => {
  return await directus.request(readMe())
}

const { state, loading, initFunctions, errors, serverPrefetched, isStaled } = useServerState({
  currentUser: async () => await fetchCurrentUser(),
})

const login = async () => {
  await directus.login('admin@example.com', 'passw0rd')
  await initFunctions.currentUser()
}

const logout = async () => {
  loading.value = true
  await directus.logout()
  state.value.currentUser = null
  loading.value = false
}
</script>

<template>
  <div>
    <div>index.vue</div>
    <pre v-text="{ state, errors, serverPrefetched, isStaled: isStaled('currentUser') }" />
    <button type="button" @click="login">
      Login
    </button>
    <button type="button" @click="logout">
      Logout
    </button>
    <br>
    <br>
    <router-link to="/test">
      Test
    </router-link>
  </div>
</template>

<style></style>
