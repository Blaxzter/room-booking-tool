<script setup lang="ts">
import { computed, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Menu, Calendar } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import GroupSwitcher from '@/components/groups/GroupSwitcher.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const routeName = computed(() => {
  return route.name
})

const showHeaderExtra = computed(() => {
  return route.meta.showHeaderExtras === true
})

const navElements = [
  { label: 'Dashboard', routeName: 'home' },
  { label: 'Requests', routeName: 'requests' }
]

const open = ref(false)
</script>

<template>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-semibold md:text-base">
      <Calendar class="h-6 w-6" />
      <span class="sr-only">Object Booking Tool</span>
    </RouterLink>
    <GroupSwitcher v-if="showHeaderExtra" />
    <template v-for="(navElement, idx) in navElements" :key="idx">
      <RouterLink
        :to="{ name: navElement.routeName }"
        class="hover:text-foreground"
        :class="routeName === navElement.routeName ? 'text-foreground' : 'text-muted-foreground'"
        >{{ navElement.label }}</RouterLink
      >
    </template>
  </nav>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="grid gap-6 text-lg font-medium">
        <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-semibold">
          <Calendar class="h-6 w-6" />
          <span class="sr-only">Object Booking Tool</span>
        </RouterLink>
        <template v-for="(navElement, idx) in navElements" :key="idx">
          <RouterLink
            :to="{ name: navElement.routeName }"
            class="active:text-foreground text-muted-foreground hover:text-foreground"
            :class="routeName === navElement.routeName ? 'text-primary' : ''"
            @click="open = false"
          >
            {{ navElement.label }}
          </RouterLink>
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>
