<script lang="ts" setup>
import { displayThumbnail, useAuthStore } from 'directus-extension-ssr/utils'
import avatar from '~/assets/img/placeholders/avatar.webp'

const authStore = useAuthStore()
</script>

<template>
  <v-app-bar scroll-behavior="elevate" theme="dark">
    <v-container class="flex items-center">
      <div class="uppercase">
        <span class="text-primary font-bold">directus</span>extension<span class="text-primary font-bold">ssr</span>
      </div>
      <v-spacer />
      <v-menu location="bottom right">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar v-if="authStore.isAuthenticated" size="small">
              <v-img :src="authStore.currentUser?.avatar ? displayThumbnail(authStore.currentUser.avatar) : avatar" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list :lines="false" theme="light" density="compact" class="py-0">
          <v-list-item @click="authStore.logout()">
            Logout
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>
