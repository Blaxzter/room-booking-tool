<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AccessSettings from '@/components/bookable-object/edit/AccessSettings.vue'
import AdditionalSettings from '@/components/bookable-object/edit/AdditionalSettings.vue'
import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import type { BookableObject } from '@/types'

const prop = defineProps({
  cardTitle: {
    type: String,
    required: true
  },
  cardDescription: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    required: true,
    default: 'default'
  },
  bookableObject: {
    type: Object as PropType<BookableObject>,
    required: false
  }
})

const cardComponent = computed(() => {
  switch (prop.cardType) {
    case 'default':
      return DefaultSettings
    case 'access':
      return AccessSettings
    case 'additional':
      return AdditionalSettings
    default:
      return DefaultSettings
  }
})
</script>

<template>
  <Card>
    <CardContent>
      <DefaultSettings :bookable-object="bookableObject" />
    </CardContent>
  </Card>
  <Card>
    <CardContent>
      <AdditionalSettings :bookable-object="bookableObject" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
