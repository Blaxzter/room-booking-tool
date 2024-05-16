<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import type { BookableObject } from '@/types'
import RandomEmoji from '@/components/utils/Emoji.vue'

import BookableObjectMenuButton from '@/components/bookable-object/BookableObjectMenuButton.vue'

// add bookable object as prop
defineProps<{
  bookableObject: BookableObject
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  index?: number
}>()

const mouseover = ref(false)
const open = ref(false)
</script>

<template>
  <div
    :class="cn('space-y-3', $attrs.class ?? '')"
    class="hover:cursor-pointer"
    @mouseover="mouseover = true"
    @mouseleave="mouseover = false"
  >
    <div class="overflow-hidden rounded-md relative">
      <img
        v-if="bookableObject.image"
        :src="`http://localhost:8055/assets/${bookableObject.image.id}`"
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
              'h-auto w-auto object-cover transition-all hover:scale-150',
              aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
              `pastel-color-${index}`
            )
          "
        >
          <div class="flex items-center justify-center h-full pointer-events-none">
            <RandomEmoji />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-start justify-between">
      <div class="space-y-1 text-sm mt-1.5">
        <h3 class="font-medium leading-none">
          {{ bookableObject.name }}
        </h3>
        <p class="text-xs text-muted-foreground">
          {{ bookableObject.description }}
        </p>
      </div>
      <div v-show="mouseover || open">
        <BookableObjectMenuButton
          v-model="open"
          :bookable-object-id="bookableObject.id"
          :bookable-object-type="bookableObject.type"
          :bookable-object-unique-id="bookableObject.uniqueId"
        />
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/colors.scss';
</style>
