<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <router-view v-bind="route.meta.state" />
</template>

<style></style>
