<script setup lang="ts">
import { CalendarDays, CalendarClock, CalendarFold, CalendarRange } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

export type CalendarViewType = 'dayGridFourWeek' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'

const model = defineModel<CalendarViewType>()
const { t } = useI18n()

const calenderType = computed(() => [
  {
    value: 'dayGridFourWeek',
    label: t('bookingComponents.calender.calenderTabs.month'),
    icon: CalendarDays
  },
  {
    value: 'timeGridWeek',
    label: t('bookingComponents.calender.calenderTabs.week'),
    icon: CalendarClock
  },
  {
    value: 'timeGridDay',
    label: t('bookingComponents.calender.calenderTabs.day'),
    icon: CalendarRange
  },
  {
    value: 'listWeek',
    label: t('bookingComponents.calender.calenderTabs.list'),
    icon: CalendarFold
  }
])

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobile = breakpoints.smallerOrEqual('lg')
</script>

<template>
  <div v-if="mobile">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary">
          <Component v-bind:is="calenderType.find((type) => type.value === model)?.icon" class="me-2" />
          {{ calenderType.find((type) => type.value === model)?.label }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{{ t('bookingComponents.calender.calenderTabs.selectView') }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          v-for="type in calenderType"
          :key="type.value"
          @click="
            () => {
              model = type.value as CalendarViewType
            }
          "
        >
          <Component v-bind:is="type.icon" class="me-2" />
          {{ type.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <div v-else>
    <Tabs v-model:model-value="model">
      <TabsList>
        <TooltipProvider v-for="type in calenderType" :key="type.value">
          <Tooltip>
            <TooltipTrigger as-child>
              <TabsTrigger :value="type.value">
                <Component v-bind:is="type.icon" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>{{ type.label }}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
    </Tabs>
  </div>
</template>

<style scoped></style>
