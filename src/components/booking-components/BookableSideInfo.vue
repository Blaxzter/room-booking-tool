<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import { PlusCircledIcon } from '@radix-icons/vue'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import type { BookableObject } from '@/types'
import BookingCardSplashImage from '@/components/home/BookingCardSplashImage.vue'

defineProps({
  bookableObject: { type: Object as PropType<BookableObject>, default: undefined }
})

defineEmits(['createBookableObject'])
</script>

<template>
  <Card class="hidden flex-col space-y-4 sm:flex" v-if="bookableObject">
    <CardHeader>
      <BookingCardSplashImage
        v-if="bookableObject.image"
        :alt_name="bookableObject.name"
        :image_id="bookableObject.image.id"
        :rounded="true"
      />
      <CardTitle class="text-2xl"> {{ bookableObject?.name }} </CardTitle>
      <CardDescription> {{ bookableObject?.description }} </CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col justify-between">
      <div class="flex-grow" />
      <Button @click="$emit('createBookableObject')" type="button">
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        Create Booking
      </Button>
    </CardContent>
  </Card>
</template>

<style scoped></style>
