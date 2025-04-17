<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Calendar } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import GroupSwitcher from '@/components/groups/GroupSwitcher.vue'

const { t } = useI18n()

const route = useRoute()

const routeName = computed(() => {
  return route.name
})

const showHeaderExtra = computed(() => {
  return route.meta.showHeaderExtras === true
})

const navElements = [
  { label: 'nav.mainNav.dashboard', routeName: 'home' },
  { label: 'nav.mainNav.requests', routeName: 'requests' }
]

const open = ref(false)
</script>

<template>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-semibold md:text-base">
      <Calendar class="h-6 w-6" />
      <span class="sr-only">{{ t('nav.mainNav.bookingTool') }}</span>
    </RouterLink>
    <GroupSwitcher v-if="showHeaderExtra" />
    <template v-for="(navElement, idx) in navElements" :key="idx">
      <RouterLink
        :to="{ name: navElement.routeName }"
        class="hover:text-foreground"
        :class="routeName === navElement.routeName ? 'text-foreground' : 'text-muted-foreground'"
        >{{ t(navElement.label) }}</RouterLink
      >
    </template>
  </nav>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">{{ t('nav.mainNav.toggleMenu') }}</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="grid gap-6 text-lg font-medium">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-semibold">
          <Calendar class="h-6 w-6" />
          <span class="sr-only">{{ t('nav.mainNav.bookingTool') }}</span>
        </RouterLink>
        <template v-for="(navElement, idx) in navElements" :key="idx">
          <RouterLink
            :to="{ name: navElement.routeName }"
            class="active:text-foreground text-muted-foreground hover:text-foreground"
            :class="routeName === navElement.routeName ? 'text-primary' : ''"
            @click="open = false"
          >
            {{ t(navElement.label) }}
          </RouterLink>
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>
