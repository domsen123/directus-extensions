<script lang="ts" setup>
import './v-menu.css'

const isOpen = ref(false)

const activatorArgs = {
  onClick: () => {
    isOpen.value = !isOpen.value
  },
}

const componentClasses = computed(() => ({
  'v-menu--active': isOpen.value,
}))

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="v-menu" :class="componentClasses">
    <slot name="activator" :args="activatorArgs" />
    <div class="v-menu__overlay" @click="closeMenu" />
    <div class="v-menu__content">
      <slot :close-menu="closeMenu" />
    </div>
  </div>
</template>

<style></style>
