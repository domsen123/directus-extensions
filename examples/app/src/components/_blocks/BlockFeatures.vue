<script lang="ts" setup>
const features = [
  {
    icon: 'i-logos:vue',
    title: 'Vue',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-logos:vitejs',
    title: 'Vite',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-logos:vuetifyjs',
    title: 'Vuetify',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-logos:unocss',
    title: 'uno.css',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-carbon:data-refinery',
    title: 'File System Routes',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-carbon:workspace-import',
    title: 'Auto Import',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-carbon:data-class',
    title: 'Layouts',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-carbon:package-text-analysis',
    title: 'WebFont Download',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    icon: 'i-carbon:data-unstructured',
    title: 'Generated Sitemap',
    message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
]
</script>

<template>
  <v-sheet class="bg-gray-50">
    <v-container class="py-18">
      <div class="flex flex-col items-center lg:max-w-lg mx-auto gap-4">
        <div class="i-carbon:chart-3d mx-auto text-6xl text-gray-500" />
        <h1 class="uppercase text-xl font-500">
          Included <span class="font-700">Features</span>
        </h1>
        <p class="leading-relaxed text-gray-500 text-center">
          Directus Extension SSR comes with the best pre-packed features. Stop wasting time on boilerplate code and focus on what matters.
        </p>
      </div>

      <div class="grid grid-cols-3 gap-10 mt-24">
        <div v-for="item in features" :key="item.icon" class="flex flex-col gap-2 items-start">
          <div class="text-4xl" :class="item.icon" />
          <h2 class="text-lg font-700">
            {{ item.title }}
          </h2>
          <p class="text-gray-500" v-text="item.message" />
        </div>
      </div>
    </v-container>
  </v-sheet>
</template>

<style></style>
