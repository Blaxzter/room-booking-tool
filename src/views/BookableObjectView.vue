<script setup lang="ts">
// get the bookable object id from the route
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import CalenderComponent from '@/components/booking-components/calender/CalenderComponent.vue'
import BookableSideInfo from '@/components/booking-components/BookableSideInfo.vue'

import { useBookableObjects } from '@/stores/bookableObjects'
import { useInitialDataStore } from '@/stores/initial'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'

// store refs
const router = useRouter()
const { fetchObjectViewData } = useInitialDataStore()
const { selectedBookableObject } = storeToRefs(useBookableObjects())
const { init_loading } = storeToRefs(useInitialDataStore())

// thats gonna be the private internal route -> Get more information, requires login -> auth check and so on
const props = defineProps<{
  id: string
  date: string
}>()

onMounted(async () => {
  await fetchObjectViewData({
    bookable_object_id: props.id as string,
    isUniqueId: false,
    select: true,
    publicView: false
  }).catch(() => {
    router.push({ name: 'home' })
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
    <div
      v-if="selectedBookableObject"
      class="px-1 py-2 h-full md:py-3 md:px-3 grid items-stretch gap-2 md:gap-4 lg:gap-6 lg:grid-cols-[400px_minmax(0,1fr)]"
    >
      <BookableSideInfo :bookable-object="selectedBookableObject" class="hidden sm:flex" />
      <CalenderComponent :top-padding="57" :date="date" />
    </div>
  </template>
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
