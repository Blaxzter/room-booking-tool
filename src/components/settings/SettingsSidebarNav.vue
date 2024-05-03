<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()

interface Item {
  title: string
  value: string
}

const selectedPage = defineModel<string>({
  default: 'profile'
})

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

const selectPage = (value: string) => {
  selectedPage.value = value
  router.push({ name: 'settings', params: { tab: value } })
}

const currentPage = computed(() => route.params.tab as string)

watch(currentPage, (value) => {
  selectedPage.value = value
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
      :class="
        cn('w-full text-left justify-start cursor-pointer', selectedPage === item.value && 'bg-muted hover:bg-muted')
      "
    >
      {{ item.title }}
    </Button>
  </nav>
</template>
