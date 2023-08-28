<script lang="ts" setup>
import { ref } from 'vue'

const currentAction = ref<string | null>(null)

const isSignUpLoading = ref(false)
const isSignInLoading = ref(false)

const payload = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})
const onSignUp = async () => {

}
const onSignIn = async () => {
}
</script>

<template>
  <v-sheet theme="dark">
    <v-container class="py-36">
      <v-row>
        <v-col cols="12" lg="7">
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
        <v-col cols="12" lg="5">
          <v-card rounded="0" theme="light">
            <v-tabs v-model="currentAction">
              <v-tab value="sign-up">
                Sign Up
              </v-tab>
              <v-tab value="sign-in">
                Sign In
              </v-tab>
            </v-tabs>
            <v-card-text>
              <v-window v-model="currentAction" class="py-2">
                <v-window-item value="sign-up">
                  <v-form @submit.prevent="onSignUp">
                    <div class="flex gap-2">
                      <v-text-field v-model="payload.first_name" class="flex-1 flex-shrink-0" label="Firstname" variant="outlined" density="comfortable" required />
                      <v-text-field v-model="payload.last_name" class="flex-1 flex-shrink-0" label="Lastname" variant="outlined" density="comfortable" required />
                    </div>
                    <v-text-field v-model="payload.email" label="Email" variant="outlined" density="comfortable" required />
                    <mrx-password-field v-model="payload.password" label="Password" variant="outlined" density="comfortable" required />
                    <v-btn type="submit" color="primary" size="large" variant="flat" block :loading="isSignUpLoading">
                      Sign Up
                    </v-btn>
                  </v-form>
                </v-window-item>
                <v-window-item value="sign-in">
                  <v-form @submit.prevent="onSignIn">
                    <v-text-field v-model="payload.email" label="Email" variant="outlined" density="comfortable" />
                    <mrx-password-field v-model="payload.password" label="Password" variant="outlined" density="comfortable" />
                    <v-btn type="submit" color="primary" size="large" variant="flat" block :loading="isSignInLoading">
                      Sign In
                    </v-btn>
                  </v-form>
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
