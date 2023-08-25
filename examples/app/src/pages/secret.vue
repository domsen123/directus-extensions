<template>
  <div class="text-center text-gray-700 px-4 py-10">
    <img :src="Logo" alt="Directus Extension SSR Logo" width="200" class="mx-auto" />
    <p class="font-bold mb-3">
      This is a very secret page - only for authorized users
    </p>
    <p class="mb-10">
      Hi {{ userStore.currentUser?.first_name || 'Anonymous' }},
      Welcome to the secret page.
    </p>
    <navigation />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onServerPrefetch } from 'vue'
import { useUser } from '~/stores/user'
import Logo from '~/assets/img/directus-ssr.png'

const userStore = useUser()

onMounted(() => {
  userStore.fetchCurrentUser()
})
onServerPrefetch(async () => {
  await userStore.fetchCurrentUser()
})
</script>

<route lang="yaml">
meta:
  auth: redirect
</route>
