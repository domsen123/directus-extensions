<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { NAVIGATION_ITEMS } from '~/constants'

const route = useRoute()
const store = useMainStore()
const company = store.getItemByCollection('info_company')
const isScrolled = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const componentClasses = computed(() => isScrolled.value
  ? ['shadow-xl']
  : [''],
)

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="fixed inset-x-0 top-0 z-100 h-15 flex items-center bg-transparent bg-white transition md:h-20" :class="componentClasses">
    <div class="flex items-center text-zinc-900 container">
      <router-link to="/" class="relative z-2 min-h-52px min-w-70px">
        <logo-small
          class="absolute block h-52px w-70px transition duration-200"
          :class="isScrolled
            ? ['md:opacity-100 delay-200']
            : [$route.path === '/' ? 'md:opacity-0' : '']"
        />
        <logo
          v-if="route.path === '/'"
          width="300"
          class="hidden translate-0 scale-100 transform transition duration-200 md:block"
          :class="isScrolled
            ? ['md:opacity-0']
            : ['md:translate-x-22 md:translate-y-40 md:scale-160 md:opacity-100']"
        />
      </router-link>
      <div class="z-2 ml-auto">
        <v-btn class="inline-flex md:hidden" icon="i-solar:hamburger-menu-line-duotone" icon-only />
        <div class="hidden items-center gap-2 md:flex">
          <div class="i-solar:phone-linear mt-1" />
          <a href="tel:+4973059277100" class="text-sm leading-none">
            {{ company?.phone }}
          </a>
        </div>
      </div>
      <div class="absolute inset-0 z-1 flex items-center justify-center">
        <div class="hidden items-center font-bold md:flex space-x-8">
          <router-link v-for="item in NAVIGATION_ITEMS" :key="item.to" class="transition duration-200" :to="item.to" :class="{ '!text-primary': $route.path === '/' && $route.hash === item.to.slice(1) }">
            {{ item.text }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>
