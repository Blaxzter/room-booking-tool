<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { onMounted, watch } from 'vue'
import router from '@/router'

interface Item {
  title: string
  value: string
}

const selectedPage = defineModel<string>()

const sidebarNavItems: Item[] = [
  {
    title: 'Profile',
    value: 'profile'
  },
  {
    title: 'Account',
    value: 'account'
  },
  {
    title: 'Notifications',
    value: 'notifications'
  }
]
const selectPage = (page: string) => {
  selectedPage.value = page
  router.push({ name: 'settings', query: { page } })
}

// add watcher for query change
watch(
  () => router.currentRoute.value.query.page,
  (page) => {
    selectedPage.value = page as string
  }
)

onMounted(() => {
  if (!router.currentRoute.value.query.page) {
    router.push({ name: 'settings', query: { page: 'profile' } })
    selectedPage.value = 'profile'
  } else {
    selectedPage.value = router.currentRoute.value.query.page as string
  }
})
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <Button
      v-for="item in sidebarNavItems"
      :key="item.title"
      as="a"
      @click="selectPage(item.value)"
      variant="ghost"
      :class="cn('w-full text-left justify-start', selectedPage === item.value && 'bg-muted hover:bg-muted')"
    >
      {{ item.title }}
    </Button>
  </nav>
</template>
