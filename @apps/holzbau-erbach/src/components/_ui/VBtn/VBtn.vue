<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { USpinner, useLoadingProps } from '../VSpinner'
import { useButtonProps } from './meta'
import './v-btn.css'

const props = defineProps({
  ...useButtonProps(),
  ...useLoadingProps(),
})

const UButton = ref<HTMLButtonElement | null>(null)
const isLink = computed(() => props.to !== '')
const isComponent = computed(() => isLink.value ? RouterLink : 'button')

const componentWidth = ref(0)

const componentClasses = computed(() => [
  'v-btn',
  props.color && `v-btn--${props.color}`,
  props.variant && `v-btn--${props.variant}`,
  props.size && `v-btn--size-${props.size}`,
  {
    'v-btn--active': props.active,
    'v-btn--icon-only': props.iconOnly,
    'v-btn--loading': props.loading,
    'v-btn--disabled': props.disabled,
  },
])

const isDisabled = computed(() => props.disabled || props.loading)

const componentArgs = computed(() => ({
  type: isLink.value ? undefined : props.type,
  to: isLink.value ? props.to : undefined,
}))

const componentStyles = computed(() => ({
  width: componentWidth.value ? `${componentWidth.value}px` : undefined,
}))

watch(() => props.loading, (loading) => {
  if (loading && UButton.value)
    componentWidth.value = UButton.value.clientWidth || 0
})
</script>

<template>
  <component :is="isComponent" v-bind="componentArgs" :class="componentClasses" :style="componentStyles" :disabled="isDisabled">
    <div class="v-btn--inner">
      <template v-if="loading">
        <u-spinner :icon="loadingIcon" />
      </template>
      <template v-else>
        <div v-if="$slots.prepend || prependIcon" class="v-btn--prepend">
          <slot name="prepend">
            <div :class="prependIcon" />
          </slot>
        </div>
        <slot>
          <div v-if="icon" class="v-btn--icon" :class="icon" />
          <div v-else class="v-btn--value" v-text="value" />
        </slot>
        <div v-if="$slots.append || appendIcon" class="v-btn--append">
          <slot name="append">
            <div :class="appendIcon" />
          </slot>
        </div>
      </template>
    </div>
  </component>
</template>

<style></style>
