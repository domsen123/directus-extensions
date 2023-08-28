<script lang="ts" setup>
import HeroBackground from '~/assets/images/bg_square.png'
import DotsLightBackground from '~/assets/images/bg_dots_light.png'
import { SERVICES } from '~/constants'

const store = useMainStore()
const company = store.getItemByCollection('info_company')
</script>

<template>
  <section class="bg-zinc-100 pt-15 md:pt-15" :style="{ backgroundImage: `url(${DotsLightBackground})` }">
    <div class="py-8 container md:py-32">
      <div class="flex flex-col gap-12 md:(flex-row gap-1)">
        <div class="flex flex-1 flex-col justify-center text-zinc-900 md:col-span-7">
          <!-- <h2 class="mb-1 text-3xl font-bold leading-9 tracking-wider md:(mb-3 text-5xl leading-10)">
            Erbacher Holzbau
          </h2> -->
          <h2 class="mb-4 text-xl leading-9 tracking-wider md:(text-3xl leading-10)">
            Unser Service im Überblick
          </h2>
          <div class="mb-8 flex flex-col gap-2">
            <div v-for="{ text } in SERVICES" :key="text" class="ml-4 flex items-center gap-2 xl:text-xl">
              <div class="h-4 w-1 bg-accent -skew-x-8" />
              <div v-text="text" />
            </div>
          </div>
          <div class="flex flex-col gap-4 md:flex-row">
            <app-button class="text-center text-black" link :href="`tel:${company?.phone}`">
              Jetzt anrufen
            </app-button>
            <app-button class="text-center text-black" @click="$router.push('/#ueber-uns')">
              Mehr erfahren
            </app-button>
          </div>
        </div>
        <div class="flex flex-1 flex-col lg:max-w-120 md:max-w-80">
          <div class="min-h-100 flex flex-col bg-zinc-100 px-4 py-8 shadow-xl">
            <h2 class="mb-8 text-center text-2xl font-bold">
              Sofort Kontakt
            </h2>

            <contact-form />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
