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
import type { BookableObject } from '@/types'
import { capitalize } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

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

const updateBookableObject = async (field: keyof BookableObject, value: any) => {
  if (selectedBookableObject.value && selectedBookableObject.value[field] !== value) {
    const { updateBookableObject } = useBookableObjects()
    await updateBookableObject(selectedBookableObject.value.id, { [field]: value })
    toast({
      title: `${capitalize(selectedBookableObject.value?.type) || 'Bookable Object'} updated`,
      description: `The ${capitalize(selectedBookableObject.value?.type) || 'Bookable Object'} "${selectedBookableObject.value.name}" has been updated.`
    })
  }
}
</script>

<template>
  <div class="container py-8 h-full max-h-full overflow-hidden" v-if="selectedBookableObject">
    <ScrollArea class="max-h-full h-full overflow-hidden me-[-12px] pe-[12px]">
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
