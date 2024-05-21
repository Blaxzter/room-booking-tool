<script setup lang="ts">
// get the bookable object id from the route
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import CalenderComponent from '@/components/booking-components/calender/CalenderComponent.vue'
import BookableSideInfo from '@/components/booking-components/BookableSideInfo.vue'

import { useBookableObjects } from '@/stores/bookableObjects'
import { useInitialDataStore } from '@/stores/initial'

// store refs
const route = useRoute()
const { fetchObjectViewData } = useInitialDataStore()
const { selectedBookableObject } = storeToRefs(useBookableObjects())

// refs
const loading = ref(true)

// thats gonna be the private internal route -> Get more information, requires login -> auth check and so on
const bookableObjectId = route.params.id

onMounted(async () => {
  await fetchObjectViewData({
    bookable_object_id: bookableObjectId as string,
    isUniqueId: false,
    select: true,
    publicView: false
  })
  loading.value = false
})
</script>

<template>
  <div
    class="px-1 py-1 h-full md:py-3 md:px-3 grid items-stretch gap-6 lg:grid-cols-[400px_minmax(0,1fr)]"
    v-if="selectedBookableObject"
  >
    <BookableSideInfo :bookableObject="selectedBookableObject" />
    <CalenderComponent :top-padding="57" />
  </div>
</template>

<style class="scss">
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
