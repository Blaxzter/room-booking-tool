<script setup lang="ts">
import { CalendarClock, CalendarDays, CalendarFold, CalendarRange } from 'lucide-vue-next'

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

export type CalendarViewType = 'dayGridFourWeek' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'

const model = defineModel<CalendarViewType>()

const calenderType = [
  {
    value: 'dayGridFourWeek',
    label: 'Day view',
    icon: CalendarDays
  },
  {
    value: 'timeGridWeek',
    label: 'Week',
    icon: CalendarClock
  },
  {
    value: 'timeGridDay',
    label: 'Day Time',
    icon: CalendarRange
  },
  {
    value: 'listWeek',
    label: 'List',
    icon: CalendarFold
  }
]

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobile = breakpoints.smallerOrEqual('lg')
</script>

<template>
  <div v-if="mobile">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary">
          <Component :is="calenderType.find((type) => type.value === model)?.icon" class="me-2" />
          {{ calenderType.find((type) => type.value === model)?.label }}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select View</DropdownMenuLabel>
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
          <Component :is="type.icon" class="me-2" />
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
                <Component :is="type.icon" />
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
