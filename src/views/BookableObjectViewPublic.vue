<script setup lang="ts">
// get the bookable object id from the route
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import CalenderComponent from '@/components/booking-components/calender/CalenderComponent.vue'
import BookableSideInfo from '@/components/booking-components/BookableSideInfo.vue'

import { useBookableObjects } from '@/stores/bookableObjects'
import { useInitialDataStore } from '@/stores/initial'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'

// store refs
const route = useRoute()
const { fetchPublicObjectViewData } = useInitialDataStore()
const { selectedBookableObject } = storeToRefs(useBookableObjects())
const { init_loading } = storeToRefs(useInitialDataStore())

// thats gonna be the private internal route -> Get more information, requires login -> auth check and so on
const bookableObjectId = route.params.id

onMounted(async () => {
  await fetchPublicObjectViewData({
    bookable_object_id: bookableObjectId as string
  })
})
</script>

<template>
  <template v-if="init_loading">
    <div class="flex items-center justify-center h-full">
      <CalenderLoader :height="400" />
    </div>
  </template>
  <template v-else>
    <BookableSideInfo :bookable-object="selectedBookableObject!" :top-nav="false" class="flex sm:hidden flex-grow" />
    <div class="px-1 py-1 h-full md:py-3 md:px-3 grid items-stretch gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
      <BookableSideInfo :bookableObject="selectedBookableObject!" class="hidden sm:flex" />
      <CalenderComponent :top-padding="0" :date="''" />
    </div>
  </template>
</template>

<style class="scss">
/* TODO top pedding when top nav is visible */

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
