<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useInitialDataStore } from '@/stores/initial'
import { useBookableObjects } from '@/stores/bookableObjects'
import { Card, CardContent } from '@/components/ui/card'

import DefaultSettings from '@/components/bookable-object/edit/DefaultSettings.vue'
import AdditionalSettings from '@/components/bookable-object/edit/AdditionalSettings.vue'
import AccessSettings from '@/components/bookable-object/edit/AccessSettings.vue'

const { fetchObjectViewData } = useInitialDataStore()
const { selectedBookableObject } = storeToRefs(useBookableObjects())

const route = useRoute()

const bookableObjectId = route.params.id

onMounted(() => {
  fetchObjectViewData({
    bookable_object_id: String(bookableObjectId),
    isUniqueId: false,
    publicView: false,
    select: true
  })
})
</script>

<template>
  <div class="container mx-auto pt-5" v-if="selectedBookableObject">
    <div class="text-2xl font-bold mb-4">Currently only viewable and not editable.</div>
    <div class="flex flex-wrap gap-4 align-top">
      <Card class="w-1/4">
        <CardContent>
          <DefaultSettings :bookable-object="selectedBookableObject" />
        </CardContent>
      </Card>
      <Card class="w-1/4">
        <CardContent>
          <AdditionalSettings :bookable-object="selectedBookableObject" />
        </CardContent>
      </Card>
      <Card class="w-1/3">
        <CardContent>
          <AccessSettings :bookable-object="selectedBookableObject" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style class="scss"></style>
