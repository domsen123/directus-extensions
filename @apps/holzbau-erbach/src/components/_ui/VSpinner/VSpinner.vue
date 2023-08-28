<script lang="ts" setup>
import './v-spinner.css'

defineProps({
  icon: { type: String, default: 'i-svg-spinners-ring-resize' },
})
</script>

<template>
  <div class="v-spinner">
    <div class="v-spinner--icon" :class="icon" />
  </div>
</template>

<style></style>
