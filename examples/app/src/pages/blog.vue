<template>
  <div class="text-center text-gray-700 px-4 py-10">
    <h1 class="text-2xl">
      Blog
    </h1>
    <p class="font-bold mb-10">
      This is an blog
    </p>
    <div class="mb-10">
      <div v-for="blog in blogStore.blogList" :key="blog.id" class="text-center">
        <h1 class="font-bold text-lg mb-5" v-text="blog.title" />
        <p class="max-w-150 mx-auto" v-text="`${blog.content.substring(0, 255)} ...`" />
      </div>
    </div>

    <div class="flex gap-2 items-center justify-center">
      <router-link to="/">
        Back to Home
      </router-link>
      <div class="i-carbon-dot-mark i-scale-2" />
      <a href="/admin">
        Admin
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onServerPrefetch } from 'vue'
import { useBlog } from '~/stores/blog'

const blogStore = useBlog()

onMounted(() => {
  blogStore.fetchBlogs()
})
onServerPrefetch(async () => {
  await blogStore.fetchBlogs()
})
</script>

<route>
{
  meta: {
    layout: 'blog'
  }
}
</route>
