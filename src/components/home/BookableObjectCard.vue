<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import { EllipsisVertical } from 'lucide-vue-next'
import type { BookableObject } from '@/types'
import RandomEmoji from '@/components/utils/Emoji.vue'
import { Button } from '@/components/ui/button'

import { useRouter } from 'vue-router'
const router = useRouter()

// add bookable object as prop
const props = defineProps<{
  bookableObject: BookableObject
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  index?: number
}>()

const mouseover = ref(false)
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
        :src="bookableObject.image"
        :alt="bookableObject.name"
        :width="width"
        :height="height"
        :class="
          cn(
            'h-auto w-auto object-cover transition-all hover:scale-105 pointer-events-none',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )
        "
      />
      <div v-else>
        <div
          :class="
            cn(
              'h-auto w-auto object-cover transition-all hover:scale-105 pointer-events-none',
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
    <div class="flex items-center justify-between">
      <div class="space-y-1 text-sm mt-1.5">
        <h3 class="font-medium leading-none">
          {{ bookableObject.name }}
        </h3>
        <p class="text-xs text-muted-foreground">
          {{ bookableObject.description }}
        </p>
      </div>
      <Button
        v-if="mouseover"
        variant="ghost"
        size="icon"
        @click.stop="router.push({ name: 'bookable-object-edit', params: { id: bookableObject.id } })"
      >
        <EllipsisVertical />
      </Button>
    </div>
  </div>
</template>

<style>
@import '@/assets/css/colors.scss';
</style>
