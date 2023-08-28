<script lang="ts" setup>
defineProps({
  label: { type: String, default: '' },
})
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<style></style>
