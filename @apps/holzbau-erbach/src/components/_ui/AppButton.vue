<script lang="ts" setup>
const props = defineProps({
  small: { type: Boolean, default: false },
  accent: { type: Boolean, default: false },
  link: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  to: { type: String, default: '' },
})

const classList = computed(() => ({
  'v-button__small': props.small,
  'v-button__accent': props.accent,
}))

const isComponent = computed(() => props.link ? 'a' : 'button')
</script>

<template>
  <component :is="isComponent" class="v-button" type="button" :class="classList">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <div class="i-svg-spinners:90-ring-with-bg" />
    </div>
    <template v-else>
      <div class="v-button__inner" />
      <slot />
    </template>
  </component>
</template>

<style>
.v-button {
  @apply bg-transparent px-6 py-3 uppercase tracking-wider relative z-20 border transition-color hover:(text-primary border-transparent);
}
.v-button.v-button__small {
  @apply px-4 py-1 text-sm;
}
.v-button.v-button__accent {
  @apply hover:(text-accent border-transparent);
}
.v-button.v-button__light {
  @apply hover:(text-primary-light border-transparent);
}
.v-button > .v-button__inner {
  @apply absolute inset-0 border-2 border-transparent z-1;
  transition: clip-path 0.3s, color 0.3s;
  clip-path: polygon(0% 0%, 0% 100%, 44% 100%, 35% 0, 47% 0, 60% 100%, 100% 100%, 100% 0%);
}

.v-button:hover .v-button__inner {
  clip-path: polygon(0% 0%, 0% 100%, 94% 100%, 0 0, 5% 0, 100% 100%, 100% 100%, 100% 0%) !important;
  @apply border-primary;
}

.v-button.v-button__accent:hover .v-button__inner {
  @apply border-accent;
}
.v-button.v-button__light:hover .v-button__inner {
  @apply border-primary-light;
}
</style>
