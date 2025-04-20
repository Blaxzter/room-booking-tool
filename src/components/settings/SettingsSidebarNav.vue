<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

interface Item {
  title: string
  value: string
}

const selectedPage = defineModel<string>({
  default: 'profile'
})

const sidebarNavItems = computed<Item[]>(() => [
  {
    title: t('settings.profile.title'),
    value: 'profile'
  },
  {
    title: t('settings.account.title'),
    value: 'account'
  },
  {
    title: t('settings.notifications.title'),
    value: 'notifications'
  }
])

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
  <nav class="hidden md:flex flex-col space-x-0 space-y-1">
    <Button
      v-for="item in sidebarNavItems"
      :key="item.value"
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
  <Tabs v-model:model-value="selectedPage" class="md:hidden">
    <TabsList>
      <TabsTrigger
        v-for="item in sidebarNavItems"
        :key="item.value"
        :value="item.value"
        @click="selectPage(item.value)"
        :class="cn('cursor-pointer', selectedPage === item.value && 'bg-muted hover:bg-muted')"
      >
        {{ item.title }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
