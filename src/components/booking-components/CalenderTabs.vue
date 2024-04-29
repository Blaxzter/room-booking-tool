<script setup lang="ts">
import { CalendarDays, CalendarClock, CalendarFold, CalendarRange } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
    label: 'Week time view',
    icon: CalendarClock
  },
  {
    value: 'timeGridDay',
    label: 'Day time view',
    icon: CalendarRange
  },
  {
    value: 'listWeek',
    label: 'List view',
    icon: CalendarFold
  }
]
</script>

<template>
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
</template>

<style scoped></style>
