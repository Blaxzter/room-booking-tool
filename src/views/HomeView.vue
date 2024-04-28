<script setup lang="ts">
import { computed, onMounted, toRefs } from 'vue'

import BookableObjectCard from '@/components/home/BookableObjectCard.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { storeToRefs } from 'pinia'

import { useInitialDataStore } from '@/stores/initial'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useGroups } from '@/stores/groups'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import { bookableObjectList } from '@/assets/ts/tempdata'
import BookableObjectRequestDialog from '@/components/home/BookableObjectRequestDialog.vue'
import { bookableObjectRandoms } from '@/assets/ts/constants'
import NameFade from '@/components/utils/NameFade.vue'
import { useGlobal } from '@/stores/global'
import _ from 'lodash'

const { fetchInitialData } = useInitialDataStore()

const { searchString } = storeToRefs(useGlobal())

const { selectedGroup } = storeToRefs(useGroups())
const bookableObjectStore = useBookableObjects()
const { getBookableObjectByGroupId } = bookableObjectStore
const { loading } = storeToRefs(bookableObjectStore)

const bookableObjects = computed(() => {
  if (!selectedGroup.value) return []
  return getBookableObjectByGroupId(selectedGroup.value.id)
})

const filteredBookableObjectList = computed(() => {
  return bookableObjectList.value.filter((bookableObject) => {
    return bookableObject.name
      .toLowerCase()
      .includes(searchString.value.toLowerCase())
  })
})

onMounted(async () => {
  await fetchInitialData()
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
              <NameFade :messages="bookableObjectRandoms" />
              {{ searchString }}
            </h2>
            <p class="text-sm text-muted-foreground">
              Here you can find all the bookable objects you have access to
              within the selected group.
            </p>
          </div>
          <div class="ml-auto mr-4">
            <BookableObjectRequestDialog />
          </div>
        </div>
        <Separator class="my-4" />
        <div class="relative">
          <CalenderLoader :height="150" v-if="loading" />
          <ScrollArea v-else>
            <div class="flex space-x-4 pb-4" v-if="bookableObjectList.length">
              <BookableObjectCard
                v-for="(bookableObject, idx) in filteredBookableObjectList"
                :key="bookableObject.name"
                :bookable-object="bookableObject"
                class="w-[250px]"
                aspect-ratio="portrait"
                :width="250"
                :height="330"
                :index="idx"
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
