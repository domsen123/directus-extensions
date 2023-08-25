<script lang="ts" setup>
import DirectusLogo from '~/assets/img/logos/directus.svg'
</script>

<template>
  <v-sheet>
    <v-container class="py-18">
      <div class="flex flex-col items-center lg:max-w-lg mx-auto gap-4">
        <directus-logo class="fill-gray-500 w-20" />
        <h1 class="uppercase text-xl font-500 -mt-3">
          Powered by <span class="font-700">directus</span>
        </h1>
        <p class="leading-relaxed text-gray-500 text-center">
          Directus Extension SSR is powered by Directus, the most flexible headless CMS and API for managing your content, your way.
        </p>
      </div>

      <div class="flex flex-col mt-8">
        <div class="flex items-center gap-10">
          <div class="flex-1 flex justify-end">
            <video autoplay loop muted class="w-2/3"><source src="https://cdn.directus.io/website/database-mirroring-220222A.mp4" type="video/mp4"></video>
          </div>
          <div class="flex-1 prose">
            <h3>Directus installs on top of any SQL database</h3>
            <p>You remain in complete control of your new or existing database. No need to migrate to a proprietary data model, so there's no vendor lock-in.</p>
            <v-btn rounded="xl" variant="flat" color="primary" size="large" class="mt-4 px-8">
              see supported SQL vendors
            </v-btn>
          </div>
        </div>
        <div class="flex items-center gap-10">
          <div class="flex-1 prose">
            <h3>Save months building and maintaining your APIs.</h3>
            <p>Design and build a production-grade REST+GraphQL API in minutes, with built-in authentication options, granular access control, and asset management.</p>
            <v-btn rounded="xl" variant="flat" color="primary" size="large" class="mt-4 px-8">
              browse api reference
            </v-btn>
          </div>
          <div class="flex-1 flex justify-start">
            <video autoplay loop muted class="w-2/3"><source src="https://cdn.directus.io/website/directus-api-220222A.mp4" type="video/mp4"></video>
          </div>
        </div>
        <div class="flex items-center gap-10 ">
          <div class="flex-1 flex justify-end">
            <video autoplay loop muted class="w-2/3"><source src="https://cdn.directus.io/website/connected-apps-220222A.mp4" type="video/mp4"></video>
          </div>
          <div class="flex-1 prose">
            <h3>Your Projects</h3>
            <p>The fastest way to build an outstanding Web-Applications, manage digital experiences content, power SaaS platforms, organize IoT data, or anything else you can dream up.</p>
            <v-btn rounded="xl" variant="flat" color="primary" size="large" class="mt-4 px-8">
              getting started
            </v-btn>
          </div>
        </div>
      </div>
    </v-container>
  </v-sheet>
</template>

<style></style>
