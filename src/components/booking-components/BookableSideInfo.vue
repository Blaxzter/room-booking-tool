<script setup lang="ts">
import { type PropType, ref } from 'vue'
import { PlusCircledIcon } from '@radix-icons/vue'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import type { BookableObject } from '@/types'
import BookingCardSplashImage from '@/components/home/BookingCardSplashImage.vue'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import BookingRequestWrapper from '@/components/booking-components/booking-request-dialog/BookingRequestWrapper.vue'

defineProps({
  bookableObject: { type: Object as PropType<BookableObject>, default: undefined }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const imageLarge = breakpoints.greaterOrEqual('lg')

const openEventDialog = ref(false)

defineEmits(['createBookableObject'])
</script>

<template>
  <Card class="hidden space-y-4 flex-row space-x-4 lg:flex-col lg:space-y-4" v-if="bookableObject">
    <CardHeader class="flex flex-row space-x-4 lg:flex-col lg:space-y-4">
      <BookingCardSplashImage
        v-if="bookableObject.image"
        :alt_name="bookableObject.name"
        :image_id="bookableObject.image.id"
        :rounded="true"
        :height="imageLarge ? undefined : 100"
      />
      <div>
        <CardTitle class="text-2xl"> {{ bookableObject?.name }} </CardTitle>
        <CardDescription> {{ bookableObject?.description }} </CardDescription>
      </div>
    </CardHeader>
    <CardContent class="flex flex-row justify-end flex-grow lg:flex-col lg:justify-stretch">
      <div class="lg:flex-grow"></div>
      <Button @click="openEventDialog = true" type="button">
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Create Booking
      </Button>
      <booking-request-wrapper v-model="openEventDialog" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
