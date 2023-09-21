<script lang="ts" setup>
import DotsLightBackground from '~/assets/images/bg_dots_light.png'
import { SERVICES } from '~/constants'
</script>

<template>
  <section class="bg-blue-gray-50 pt-15 md:pt-15" :style="{ backgroundImage: `url(${DotsLightBackground})` }">
    <div class="py-8 container md:py-32">
      <div class="flex flex-col">
        <div class="flex items-center gap-2 xl:text-xl">
          <div class="h-4 w-1 bg-primary -skew-x-8" />
          <div class="text-uppercase" v-text="`Was wir Ihnen bieten`" />
        </div>
        <h2 class="mb-16 text-4xl tracking-wide uppercase">
          Unsere <span class="font-bold">Leistungen</span>
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div v-for="{ text, svg, lines } in SERVICES" :id="text" :key="text" class="flex flex-col">
            <div class="mb-2 text-primary" v-html="svg" />
            <h2 class="mb-4 text-2xl font-semibold" v-text="text" />
            <p v-for="line in lines" :key="line" class="mb-2 leading-relaxed text-blue-gray-600" v-text="line" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
