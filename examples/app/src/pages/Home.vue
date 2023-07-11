<template>
  <div class="text-center text-gray-700 px-4 py-10">
    <img :src="Logo" alt="Directus Extension SSR Logo" width="200" class="mx-auto" />
    <p class="font-bold mb-3">
      Directus Extension SSR
    </p>
    <p class="mb-10">
      Hi, <span class="text-primary"> {{ currentUser?.first_name }}</span> 👋 <br />
      This is a demo of a Directus Extension SSR.
    </p>
    <div class="flex gap-2 items-center justify-center">
      <router-link to="/about">
        About
      </router-link>
      <div class="i-carbon-dot-mark i-scale-2" />
      <a href="/admin">
        Admin
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onServerPrefetch } from 'vue'
import { useUser } from '~/stores/user'
import Logo from '~/assets/img/directus-ssr.png'

const { currentUser, fetchCurrentUser } = useUser()

// if (!currentUser) fetchCurrentUser()
onMounted(() => {
  if (!currentUser) fetchCurrentUser()
})
onServerPrefetch(async () => {
  const user = await fetchCurrentUser(true)
  console.log(user)
})
</script>
