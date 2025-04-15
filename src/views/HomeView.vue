<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { useInitialDataStore } from '@/stores/initial'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useGlobal } from '@/stores/global'
import { BookableObjectTermType } from '@/composables/useBookableObjectTerms'

import BookableObjectCard from '@/components/home/BookableObjectCard.vue'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import BookableObjectRequestDialog from '@/components/bookable-object/BookableObjectRequestDialog.vue'
import NameFade from '@/components/utils/NameFade.vue'
import NotFoundAnimation from '@/components/animations/NotFoundAnimation.vue'
import DemoModeOverlay from '@/components/utils/DemoModeOverlay.vue'

const router = useRouter()
const { t } = useI18n()

const bookableObjectStore = useBookableObjects()

const { fetchDashboardViewData } = useInitialDataStore()
const { searchString } = storeToRefs(useGlobal())

const { loading, bookableObjects } = storeToRefs(bookableObjectStore)

const filteredBookableObjectList = computed(() => {
  if (!bookableObjects.value) return []
  return bookableObjects.value.filter((bookableObject) => {
    return bookableObject.name.toLowerCase().includes(searchString.value.toLowerCase())
  })
})

onMounted(async () => {
  await fetchDashboardViewData()
})
</script>

<template>
  <DemoModeOverlay :show-trigger="false" identifier="2" />
  <div class="flex flex-col">
    <div class="col-span-3 lg:col-span-4">
      <div class="h-full px-4 py-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-2xl font-semibold tracking-tight">
              {{ t('home.title.your') }}
              <NameFade :termType="BookableObjectTermType.PLURAL" />
              {{ searchString }}
            </h2>
            <p class="text-sm text-muted-foreground">
              {{ t('home.description') }}
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
            <div class="flex space-x-4 pb-4 overflow-visible" v-if="bookableObjects && bookableObjects.length > 0">
              <BookableObjectCard
                v-for="bookableObject in filteredBookableObjectList"
                :key="bookableObject.name"
                :bookable-object="bookableObject"
                class="w-[150px] min-w-[150px] sm:w-[250px] sm:min-w-[250px]"
                aspect-ratio="portrait"
                :width="250"
                :height="330"
                :index="parseInt(bookableObject.id) % 500"
                @click="
                  () =>
                    router.push({
                      name: 'my-bookable-object',
                      params: { id: bookableObject.id }
                    })
                "
              />
            </div>
            <div v-else class="mt-3">
              <NotFoundAnimation :height="200" />
              <p class="text-center text-muted-foreground">
                {{ t('home.noBookableObjects.prefix') }} <NameFade :termType="BookableObjectTermType.PLURAL" /> {{ t('home.noBookableObjects.suffix') }}
              </p>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  </div>
</template>
