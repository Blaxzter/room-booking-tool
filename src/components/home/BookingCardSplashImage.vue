<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  image_id: string
  alt_name?: string
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  rounded?: boolean
}>()
</script>

<template>
  <img
    :src="`http://localhost:8055/assets/${image_id}`"
    :alt="alt_name ?? 'Splash Image'"
    :width="width"
    :height="height"
    :class="
      cn(
        'h-auto w-auto object-cover transition-all hover:scale-105',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
        rounded && 'rounded-lg'
      )
    "
  />
</template>
