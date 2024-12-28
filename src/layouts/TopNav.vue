<script setup lang="ts">
import MainNav from '@/components/nav/MainNav.vue'
import GroupSwitcher from '@/components/groups/GroupSwitcher.vue'
import { Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserNav from '@/components/nav/UserNav.vue'
import { computed, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useGlobal } from '@/stores/global'
import { useRoute } from 'vue-router'
import { useBookableObjects } from '@/stores/bookableObjects'
import BookableSideInfo from '@/components/booking-components/BookableSideInfo.vue'

const { searchString } = storeToRefs(useGlobal())
const { selectedBookableObject } = storeToRefs(useBookableObjects())

const { width } = useWindowSize()

const showSearch = ref(true)
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

watchEffect(() => {
  const smBreakpoint = 640 // Adjust this to your actual breakpoint
  showSearch.value = width.value > smBreakpoint
})

const route = useRoute()
const showHeaderExtra = computed(() => {
  return route.meta.showHeaderExtras === true
})
const bookableObjectView = computed(() => {
  return route.meta.bookableObjectView === true
})
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-2 md:px-4">
      <MainNav />
      <BookableSideInfo
        v-if="bookableObjectView"
        :bookable-object="selectedBookableObject!"
        :top-nav="true"
        class="flex sm:hidden flex-grow"
      />
      <div v-show="width > 640 || !showSearch" v-if="showHeaderExtra" class="sm:block md:hidden ms-2 sm:ms-3">
        <GroupSwitcher />
      </div>
      <div
        class="ml-auto flex items-center justify-end space-x-2 md:space-x-4"
        :class="{ 'flex-grow': !bookableObjectView }"
      >
        <template v-if="showHeaderExtra">
          <Input
            v-model="searchString"
            type="search"
            placeholder="Search..."
            class="ms-2 sm:ms-3 hidden sm:block lg:w-[300px]"
            :style="{ display: showSearch ? 'block' : 'none' }"
          />
          <Button variant="outline" size="icon" class="sm:hidden flex-shrink-0" @click="toggleSearch">
            <Search class="w-4 h-4" />
          </Button>
        </template>
        <UserNav />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
