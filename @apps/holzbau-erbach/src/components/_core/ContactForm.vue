<script lang="ts" setup>
import { createItem } from '@directus/sdk'
import type { AppDirectusClient } from 'directus-extension-ssr/types'
import { SERVICES } from '~/constants'

const directus = inject('directus') as AppDirectusClient

const loading = ref(false)
const success = ref(false)

const payload = reactive({
  name: '',
  phone: '',
  topic: 'Dachdeckung',
  postcode: '',
  message: '',
})
const onSubmit = async (e: Event) => {
  e.preventDefault()
  try {
    loading.value = true
    await directus.request(createItem('inquiries', {
      name: payload.name,
      phone: payload.phone,
      topic: payload.topic,
      postcode: payload.postcode,
      message: payload.message,
    }))
  }
  catch (error: any) {
    console.error(error)
  }
  finally {
    loading.value = false
    success.value = true
    payload.name = ''
    payload.phone = ''
    payload.topic = 'Dachdeckung'
    payload.postcode = ''
    payload.message = ''

    setTimeout(() => {
      success.value = false
    }, 3000)
  }
}
</script>

<template>
  <form class="flex flex-1 flex-col gap-3" @submit.prevent="onSubmit">
    <template v-if="success">
      <div class="flex flex-1 flex-col items-center justify-center">
        <div class="text-xl font-bold">
          Vielen Dank für Ihe Nachricht
        </div>
        <div class="text-lg">
          Wir werden uns in Kürze bei Ihnen melden.
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-3 md:flex-row">
        <app-form-group label="Name" class="flex-1">
          <input v-model="payload.name" type="text" class="w-full border bg-zinc-50 px-3 py-2 text-sm" />
        </app-form-group>
        <app-form-group label="Telefon" class="flex-1">
          <input v-model="payload.phone" type="phone" class="w-full border bg-zinc-50 px-3 py-2 text-sm" />
        </app-form-group>
      </div>
      <div class="flex flex-col gap-3 md:flex-row">
        <app-form-group label="Interesse am Thema" class="flex-1">
          <select v-model="payload.topic" class="w-full border bg-zinc-50 px-3 py-2 text-sm">
            <option v-for="{ text } in SERVICES" :key="text" v-text="text" />
          </select>
        </app-form-group>
        <app-form-group label="Im Einsatzgebiet" class="flex-1">
          <input v-model="payload.postcode" type="text" class="w-full border bg-zinc-50 px-3 py-2 text-sm" placeholder="89231" />
        </app-form-group>
      </div>
      <div>
        <app-form-group label="Ihre Nachricht" class="flex-1">
          <textarea
            v-model="payload.message"
            class="w-full resize-none border bg-zinc-50 px-3 py-2 text-sm"
            rows="6"
            placeholder="Ihre Nachricht ...."
          />
        </app-form-group>
      </div>
      <app-button type="submit" class="text-center" :loading="loading">
        Absenden
      </app-button>
    </template>
  </form>
</template>

<style></style>
