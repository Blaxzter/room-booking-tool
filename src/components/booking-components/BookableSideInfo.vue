<script setup lang="ts">
import { defineProps, type PropType } from 'vue'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { BookableObject } from '@/types'

defineProps({
  bookableObject: { type: Object as PropType<BookableObject>, default: undefined }
})
</script>

<template>
  <Card class="hidden flex-col space-y-4 sm:flex">
    <CardHeader>
      <CardTitle class="text-2xl"> {{ bookableObject?.name }} </CardTitle>
      <CardDescription> {{ bookableObject?.description }} </CardDescription>
    </CardHeader>
    <CardContent class="d-flex justify-between">
      <p>This is a room booking page. Here you can book a room for a meeting or an event.</p>
    </CardContent>
  </Card>
</template>

<style scoped></style>
