<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'
import type { BookableObject } from '@/types'
import RandomEmoji from '@/components/utils/Emoji.vue'

import BookableObjectMenuButton from '@/components/bookable-object/BookableObjectMenuButton.vue'
import BookingCardSplashImage from '@/components/home/BookingCardSplashImage.vue'
import processImage from '@/assets/ts/image-utils'

const backendUrl = inject('backendUrl')

// add bookable object as prop
const props = defineProps<{
  bookableObject: BookableObject
  aspectRatio?: 'portrait' | 'landscape'
  width?: number
  height?: number
  index?: number
}>()

const mouseover = ref(false)
const open = ref(false)

// map of bookable object ids to colors
const idToColor = ref(new Map<string, string>())
const getImageColor = async (image_id: string) => {
  return await processImage(`${backendUrl}/assets/${image_id}`).then((color) => {
    idToColor.value.set(image_id, color)
    console.log(idToColor.value)
    return color
  })
}

onMounted(() => {
  if (props.bookableObject.image) {
    getImageColor(props.bookableObject.image.id)
  }
})
</script>

<template>
  <div
    :class="cn('space-y-3', $attrs.class ?? '')"
    class="hover:cursor-pointer"
    @mouseover="mouseover = true"
    @mouseleave="mouseover = false"
  >
    <div class="overflow-hidden rounded-md relative">
      <BookingCardSplashImage
        v-if="bookableObject.image"
        :alt_name="bookableObject.name"
        :image_id="bookableObject.image.id"
        :width="width"
        :height="height"
        :aspectRatio="aspectRatio"
        :style="`background-color:` + (idToColor.get(bookableObject.image.id) ?? 'white')"
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
