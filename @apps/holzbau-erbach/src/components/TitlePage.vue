<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section id="hero" class="bg-zinc-800 pt-15 md:pt-15">
    <div class="py-8 container md:py-16">
      <h1 class="text-4xl font-bold text-zinc-50 md:text-6xl" v-text="title" />
    </div>
  </section>
  <slot />
</template>

<style></style>
