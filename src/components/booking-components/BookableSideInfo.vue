<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import { PlusCircledIcon } from '@radix-icons/vue'

import { Button } from '@/components/ui/button'

import type { BookableObject } from '@/types'
import BookingCardSplashImage from '@/components/home/BookingCardSplashImage.vue'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import BookingRequestWrapper from '@/components/booking-components/booking-request-dialog/BookingRequestWrapper.vue'

const props = defineProps({
  bookableObject: { type: Object as PropType<BookableObject>, default: undefined },
  topNav: {
    type: Boolean,
    default: false
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const imageLarge = breakpoints.smallerOrEqual('lg')
const imageSmall = breakpoints.smallerOrEqual('md')

const imageHeight = computed(() => {
  if (props.topNav) return 40
  if (imageSmall.value) return 50
  if (imageLarge.value) return 75
  return undefined
})

const openEventDialog = ref(false)

defineEmits(['createBookableObject'])
</script>

<template>
  <div
    class="flex-row lg:flex-col lg:space-y-4"
    :class="[!topNav ? 'hidden rounded-lg border bg-card' : '']"
    v-if="bookableObject"
  >
    <div class="flex flex-row p-2 lg:p-4 lg:flex-col lg:space-y-4">
      <BookingCardSplashImage
        v-if="bookableObject.image"
        :alt_name="bookableObject.name"
        :image_id="bookableObject.image.id"
        :rounded="true"
        :height="imageHeight"
        class="me-2 lg:me-0"
      />
      <div class="overflow-hidden">
        <div class="sm:text-2xl text-sm" :class="{ 'text-nowrap text-l': topNav }">{{ bookableObject?.name }}</div>
        <div
          class="text-sm text-muted-foreground"
          :class="{
            'text-nowrap line-clamp-1': topNav
          }"
        >
          {{ bookableObject?.description }}
        </div>
      </div>
    </div>
    <div
      class="flex flex-row justify-end items-center flex-grow lg:items-start lg:flex-col lg:justify-stretch p-2 md:p-4 lg:p-6"
    >
      <div class="lg:flex-grow"></div>
      <Button @click="openEventDialog = true" :size="topNav ? 'icon' : 'default'">
        <PlusCircledIcon class="h-6 w-6 sm:h-4 sm:w-4" />
        <span class="hidden sm:inline ms-2">Create Booking</span>
      </Button>
      <booking-request-wrapper v-model="openEventDialog" />
    </div>
  </div>
</template>

<style scoped></style>
