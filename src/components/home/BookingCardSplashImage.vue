<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  image_id: string
  alt_name?: string
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  rounded?: boolean
}>()

const computedWidth = computed(() => {
  if (props.width) return props.width
  if (props.height) {
    return props.aspectRatio === 'portrait' ? (props.height * 3) / 4 : props.height
  }
  return undefined
})

const computedHeight = computed(() => {
  if (props.height) return props.height
  if (props.width) {
    return props.aspectRatio === 'portrait' ? (props.width * 4) / 3 : props.width
  }
  return undefined
})

const aspectClass = computed(() => {
  if (props.aspectRatio === 'portrait') return 'aspect-[3/4]'
  if (props.aspectRatio === 'landscape') return 'aspect-[4/3]'
  return 'aspect-square'
})
</script>

<template>
  <img
    :src="`http://localhost:8055/assets/${image_id}`"
    :alt="alt_name ?? 'Splash Image'"
    :width="computedWidth"
    :height="computedHeight"
    :class="cn('object-cover transition-all hover:scale-105', aspectClass, rounded && 'rounded-lg')"
  />
</template>
