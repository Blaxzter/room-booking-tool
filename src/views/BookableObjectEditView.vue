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
import { ScrollArea } from '@/components/ui/scroll-area'

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

const updateBookableObject = (data: any) => {
  console.log('update bookable object', data)
}
</script>

<template>
  <div class="container py-8 h-full max-h-full overflow-hidden" v-if="selectedBookableObject">
    <ScrollArea class="max-h-full h-full overflow-hidden me-[-12px] pe-[12px]">
      <div class="text-2xl font-bold mb-4">Currently only viewable and not editable.</div>
      <div class="flex flex-wrap justify-center gap-4 align-top flex-col md:flex-row lg:justify-start">
        <Card class="lg:max-w-[320px] md:w-[calc(50%-0.5rem)] lg:w-[calc(30%-0.7rem)]">
          <CardContent>
            <DefaultSettings :bookable-object="selectedBookableObject" @update="updateBookableObject" />
          </CardContent>
        </Card>
        <Card class="lg:max-w-[320px] md:w-[calc(50%-0.5rem)] lg:w-[calc(30%-0.7rem)]">
          <CardContent>
            <AdditionalSettings :bookable-object="selectedBookableObject" @update="updateBookableObject" />
          </CardContent>
        </Card>
        <Card class="lg:max-w-[400px] md:w-[calc(50%-0.5rem)] lg:w-[calc(40%-0.7rem)]">
          <CardContent>
            <AccessSettings :bookable-object="selectedBookableObject" @update="updateBookableObject" />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  </div>
</template>

<style class="scss"></style>
