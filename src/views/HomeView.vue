<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BookableObjectCard from '@/components/home/BookableObjectCard.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusCircledIcon } from '@radix-icons/vue'
import router from '@/router'
import { bookableObjectList } from '@/assets/ts/tempdata'
import { useInitialDataStore } from '@/stores/initial'
import { useBookableObjects } from '@/stores/bookableObjects'

const { fetchInitialData } = useInitialDataStore()

const { bookableObjects } = useBookableObjects()

const computedBookableObjectList = computed(() => {
  console.log(bookableObjects)
  return bookableObjects
})

onMounted(async () => {
  fetchInitialData()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="col-span-3 lg:col-span-4">
      <div class="h-full px-4 py-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
            <p class="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>
          <div class="ml-auto mr-4">
            <Button>
              <PlusCircledIcon class="mr-2 h-4 w-4" />
              Add music
            </Button>
          </div>
        </div>
        <Separator class="my-4" />
        <div class="relative">
          <ScrollArea>
            <div class="flex space-x-4 pb-4">
              <BookableObjectCard
                v-for="bookableObject in bookableObjectList"
                :key="bookableObject.name"
                :bookable-object="bookableObject"
                class="w-[250px]"
                aspect-ratio="portrait"
                :width="250"
                :height="330"
                @click="
                  () =>
                    router.push({
                      name: 'bookable-object',
                      params: { id: bookableObject.id }
                    })
                "
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  </div>
</template>
