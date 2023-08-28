<script lang="ts" setup>
import { readItems } from '@directus/sdk'
import type { AppDirectusClient } from 'directus-extension-ssr/types'
import DotsLightBackground from '~/assets/images/bg_dots_light.png'

const directus = inject('directus') as AppDirectusClient
const testimonials = ref<any[]>([])

const onInit = async () => {
  try {
    const result = await directus.request(readItems('testimonials', {
      fields: ['id', 'name', 'position', 'message', 'avatar'],
      sort: '-date_created',
      limit: -1,
    }))
    testimonials.value = result
  }
  catch (error: any) {

  }
}

const activeIndex = ref(1)

const prevIndex = computed(() => {
  if (activeIndex.value === 0)
    return testimonials.value.length - 1

  return activeIndex.value - 1
})

const nextIndex = computed(() => {
  if (activeIndex.value === testimonials.value.length - 1)
    return 0

  return activeIndex.value + 1
})

onMounted(onInit)
onServerPrefetch(async () => await onInit())
</script>

<template>
  <section class="bg-blue-gray-50 pt-15 md:pt-15" :style="{ backgroundImage: `url(${DotsLightBackground})` }">
    <div class="py-8 container md:py-32">
      <div class="flex flex-col">
        <div class="flex items-center gap-2 xl:text-xl">
          <div class="h-4 w-1 bg-primary -skew-x-8" />
          <div class="text-uppercase" v-text="`Feedback`" />
        </div>
        <h2 class="mb-4 text-4xl tracking-wide uppercase md:mb-16">
          Was unsere <span class="font-bold">Kunden</span> sagen
        </h2>
        <div v-if="testimonials.length" class="relative mt-16">
          <div class="flex items-center justify-center overflow-x-hidden">
            <div class="flex flex-1 justify-center -ml-5 sm:ml-auto">
              <img :src="`/assets/${testimonials[prevIndex].avatar}?width=300&height=300&fit=cover&quality=80`" class="h-15 w-15 cursor-pointer rounded-full object-cover blur-sm md:h-30 md:w-30" @click="activeIndex = prevIndex" />
            </div>
            <div class="flex flex-1 justify-center">
              <img :src="`/assets/${testimonials[activeIndex].avatar}?width=300&height=300&fit=cover&quality=80`" class="h-25 w-25 rounded-full object-cover md:h-40 md:w-40" />
            </div>
            <div class="flex flex-1 justify-center -mr-5 sm:mr-auto">
              <img :src="`/assets/${testimonials[nextIndex].avatar}?width=300&height=300&fit=cover&quality=80`" class="h-15 w-15 cursor-pointer rounded-full object-cover blur-sm md:h-30 md:w-30" @click="activeIndex = nextIndex" />
            </div>
          </div>
          <transition name="fade" mode="out-in">
            <div v-if="testimonials.length" :key="activeIndex" class="mt-4 text-center">
              <div class="text-xl font-semibold" v-text="testimonials[activeIndex].name" />
              <div class="text-sm text-gray-500" v-text="testimonials[activeIndex].position" />
              <div class="mx-auto my-4 h-5 w-1px bg-primary" />
              <p class="mx-auto lg:max-w-150 md:px-8">
                {{ testimonials[activeIndex].message }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
