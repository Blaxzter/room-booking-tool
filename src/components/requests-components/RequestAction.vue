<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CheckIcon, CalendarIcon, XIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import type { BookableObject, Booking } from '@/types'
import { useRequests } from '@/stores/requests'
import { useRouter } from 'vue-router'

const { approveRequest, rejectRequest } = useRequests()
const { requestLoading } = storeToRefs(useRequests())
const { t } = useI18n()

defineProps<{
  booking: Booking
}>()

const router = useRouter()
const goToCalender = (booking: Booking) => {
  router.push({
    name: 'my-bookable-object',
    params: { id: (booking.bookable_object_id as BookableObject).id },
    query: { date: booking.start_date }
  })
}
</script>

<template>
  <div class="flex gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="approveRequest(booking)" :loading="requestLoading">
            <CheckIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ t('requestsComponents.requestAction.acceptBooking') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="rejectRequest(booking)" :loading="requestLoading">
            <XIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ t('requestsComponents.requestAction.declineBooking') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="goToCalender(booking)">
            <CalendarIcon class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ t('requestsComponents.requestAction.goToCalendar') }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
