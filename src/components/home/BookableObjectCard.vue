<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { BookableObject } from '@/types'

// add bookable object as prop
const props = defineProps<{
  bookableObject: BookableObject
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
}>()

</script>

<template>
  <div :class="cn('space-y-3', $attrs.class ?? '')" class="hover:cursor-pointer">
    <div class="overflow-hidden rounded-md">
      <img
        :src="bookableObject.image"
        :alt="bookableObject.name"
        :width="width"
        :height="height"

        :class="cn(
          'h-auto w-auto object-cover transition-all hover:scale-105',
          aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
        )"
      >
    </div>
    <div class="space-y-1 text-sm">
      <h3 class="font-medium leading-none">
        {{ bookableObject.name }}
      </h3>
      <p class="text-xs text-muted-foreground">
        {{ bookableObject.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
