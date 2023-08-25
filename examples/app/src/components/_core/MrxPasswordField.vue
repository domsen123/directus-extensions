<script lang="ts" setup>
const showPassword = ref(false)
const togglePassword = useToggle(showPassword)
</script>

<template>
  <v-text-field
    :type="showPassword ? 'text' : 'password'"
    :append-inner-icon="showPassword ? 'i-carbon:view' : 'i-carbon:view-off'"
    @click:append-inner="togglePassword()"
  />
</template>
