<template>
  <div class="text-center text-gray-700 px-4 py-10">
    <img :src="Logo" alt="Directus Extension SSR Logo" width="200" class="mx-auto" />
    <p class="font-bold mb-10">
      Directus Extension SSR
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

<script setup>
import Logo from '~/assets/img/directus-ssr.png'
</script>
