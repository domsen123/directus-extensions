<script lang="ts" setup>
const currentTab = ref<'global' | 'pages'>()
</script>

<template>
  <v-app>
    <v-navigation-drawer theme="dark" floating>
      <v-toolbar flat color="transparent" density="compact" />
      <v-tabs v-model="currentTab">
        <v-tab class="flex-1" value="global">
          Global
        </v-tab>
        <v-tab class="flex-1" value="pages">
          Pages
        </v-tab>
      </v-tabs>
      <v-window v-model="currentTab">
        <v-window-item value="global">
          <v-list :lines="false" density="compact" nav>
            <v-list-subheader>Settings</v-list-subheader>
            <v-list-item title="Defaults" />
            <v-list-item title="Themes" />
          </v-list>
        </v-window-item>
        <v-window-item value="pages"></v-window-item>
      </v-window>
    </v-navigation-drawer>
    <v-navigation-drawer theme="dark" location="right" floating>
      <v-toolbar flat color="transparent" density="compact">
        <v-btn class="flex-1" prepend-icon="i-carbon:view">
          Preview
        </v-btn>
        <v-btn class="flex-1" prepend-icon="i-carbon:upload" color="primary">
          Publish
        </v-btn>
      </v-toolbar>
    </v-navigation-drawer>
    <v-app-bar theme="dark" elevation="0" density="compact" />
    <v-main>
      <slot />
    </v-main>
    <v-footer />
  </v-app>
</template>

<style></style>
