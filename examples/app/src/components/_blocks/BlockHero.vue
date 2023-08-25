<script lang="ts" setup>
import { ref } from 'vue'

const currentAction = ref<string | null>(null)
</script>

<template>
  <v-sheet theme="dark">
    <v-container class="py-36">
      <v-row>
        <v-col cols="12" lg="8">
          <div class="prose">
            <h1 class="font-medium leading-12">
              Create SSR-Rendered Directus <span class="whitespace-nowrap">Web-Applications</span> in no time.
            </h1>
            <p class="text-lg text-white/70">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            </p>
            <v-btn rounded="xl" variant="outlined" size="large" class="mt-4 px-8">
              read more
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card rounded="0" theme="light">
            <v-tabs v-model="currentAction">
              <v-tab value="sign-up">
                Sign Up
              </v-tab>
              <v-tab value="sign-in">
                Sign In
              </v-tab>
            </v-tabs>
            <v-card-text class="p-8">
              <v-window v-model="currentAction">
                <v-window-item value="sign-up">
                  <v-text-field label="Name" variant="outlined" />
                  <v-text-field label="Email" variant="outlined" />
                  <v-text-field label="Password" variant="outlined" />
                  <v-btn color="primary" size="large" variant="flat" block>
                    Sign Up
                  </v-btn>
                </v-window-item>
                <v-window-item value="sign-in">
                  <v-text-field label="Email" variant="outlined" />
                  <v-text-field label="Password" variant="outlined" />
                  <v-btn color="primary" size="large" variant="flat" block>
                    Sign In
                  </v-btn>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<style></style>
