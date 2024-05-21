<script setup lang="ts">
// get the bookable object id from the route
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import CalenderComponent from '@/components/booking-components/calender/CalenderComponent.vue'
import BookableSideInfo from '@/components/booking-components/BookableSideInfo.vue'

import { useBookableObjects } from '@/stores/bookableObjects'

// store refs
const route = useRoute()
const { getBookableObjectById } = useBookableObjects()

// refs
const loading = ref(true)

const bookableObject = ref()

// thats gonna be the private internal route -> Get more information, requires login -> auth check and so on
const bookableObjectId = route.params.id

onMounted(async () => {
  bookableObject.value = await getBookableObjectById({ id: bookableObjectId as string, isUniqueId: true, select: true })
  loading.value = false
})
</script>

<template>
  <div class="px-1 py-1 h-full md:py-3 md:px-3 grid items-stretch gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
    <BookableSideInfo :bookableObject="bookableObject" />
    <CalenderComponent />
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
