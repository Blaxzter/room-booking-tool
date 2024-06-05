<script setup lang="ts">
import { CheckIcon, CalendarIcon, XIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import type { Booking } from '@/types'

defineProps<{
  booking: Booking
}>()

const acceptBooking = (id: string) => {
  navigator.clipboard.writeText(id)
}

const declineBooking = (id: string) => {
  navigator.clipboard.writeText(id)
}

const goToCalender = (id: string) => {
  navigator.clipboard.writeText(id)
}
</script>

<template>
  <div class="flex gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon">
            <CheckIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Accept booking</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon">
            <XIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Decline booking</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon">
            <CalendarIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Go to calender</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
