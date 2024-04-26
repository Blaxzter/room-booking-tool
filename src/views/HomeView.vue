<script setup lang="ts">
import { computed, onMounted } from 'vue'

import BookableObjectCard from '@/components/home/BookableObjectCard.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PlusCircledIcon } from '@radix-icons/vue'
import { storeToRefs } from 'pinia'

import router from '@/router'

import { useInitialDataStore } from '@/stores/initial'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useGroups } from '@/stores/groups'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import { bookableObjectList } from '@/assets/ts/tempdata'

const { fetchInitialData } = useInitialDataStore()

const { selectedGroup } = storeToRefs(useGroups())
const bookableObjectStore = useBookableObjects()
const { getBookableObjectByGroupId } = bookableObjectStore
const { loading } = storeToRefs(bookableObjectStore)

const bookableObjectRandoms = ['Rooms', 'Objects', 'Spaces', 'Anything']

const bookableObjects = computed(() => {
  if (!selectedGroup.value) return []
  return getBookableObjectByGroupId(selectedGroup.value.id)
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
            <h2 class="text-2xl font-semibold tracking-tight">
              Your
              <span>{{
                bookableObjectRandoms[
                  Math.floor(Math.random() * bookableObjectRandoms.length)
                ]
              }}</span>
            </h2>
            <p class="text-sm text-muted-foreground">
              Here you can find all the bookable objects you have access to
              within the selected group.
            </p>
          </div>
          <div class="ml-auto mr-4">
            <Button>
              <PlusCircledIcon class="mr-2 h-4 w-4" />
              Add new
            </Button>
          </div>
        </div>
        <Separator class="my-4" />
        <div class="relative">
          <CalenderLoader :height="150" v-if="loading" />
          <ScrollArea v-else>
            <div class="flex space-x-4 pb-4" v-if="bookableObjectList.length">
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
            <div v-else>
              <p class="text-center text-muted-foreground">
                No bookable objects found
              </p>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  </div>
</template>
