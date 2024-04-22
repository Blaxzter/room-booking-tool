<script setup lang="ts">
import MainNav from '@/components/nav/MainNav.vue'
import GroupSwitcher from '@/components/groups/GroupSwitcher.vue'
import { Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserNav from '@/components/nav/UserNav.vue'
import { ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const showSearch = ref(true)
const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

watchEffect(() => {
  const smBreakpoint = 640 // Adjust this to your actual breakpoint
  showSearch.value = width.value > smBreakpoint
})
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav />
      <div class="block md:hidden ms-3" v-show="width > 640 || !showSearch">
        <GroupSwitcher />
      </div>
      <div class="ml-auto flex items-center justify-end space-x-4 flex-grow">
        <Input
          type="search"
          placeholder="Search..."
          class="ms-3 hidden sm:block lg:w-[300px]"
          :style="{ display: showSearch ? 'block' : 'none' }"
        />
        <Button
          variant="outline"
          size="icon"
          class="sm:hidden flex-shrink-0"
          @click="toggleSearch"
        >
          <Search class="w-4 h-4" />
        </Button>
        <UserNav />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
