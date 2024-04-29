<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { BookableObject } from '@/types'
import RandomEmoji from '@/components/utils/RandomEmoji.vue'

// add bookable object as prop
const props = defineProps<{
  bookableObject: BookableObject
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  index?: number
}>()
</script>

<template>
  <div :class="cn('space-y-3', $attrs.class ?? '')" class="hover:cursor-pointer">
    <div class="overflow-hidden rounded-md">
      <img
        v-if="bookableObject.image"
        :src="bookableObject.image"
        :alt="bookableObject.name"
        :width="width"
        :height="height"
        :class="
          cn(
            'h-auto w-auto object-cover transition-all hover:scale-105',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )
        "
      />
      <div v-else>
        <div
          :class="
            cn(
              'h-auto w-auto object-cover transition-all hover:scale-105',
              aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
              `pastel-color-${index}`
            )
          "
        >
          <div class="flex items-center justify-center h-full">
            <RandomEmoji />
          </div>
        </div>
      </div>
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

<style>
@import '@/assets/css/colors.scss';
</style>
