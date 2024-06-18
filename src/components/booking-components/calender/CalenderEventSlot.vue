<script setup lang="ts">
import { cn } from '@/lib/utils'

import { PencilIcon } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'

import ConfirmationIcon from '@/components/booking-components/calender/ConfirmationIcon.vue'
import { useLocalUser } from '@/stores/localUser'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const { userHasCreatedBooking } = useLocalUser()
const { toast } = useToast()

const eventClick = (arg: any) => {
  console.log(arg.event)
  const canPossiblyEdit = userHasCreatedBooking(arg.event.booking_id)
  toast({
    title: 'Event Daten' + (canPossiblyEdit ? ' (Editing is coming soon)' : ''),
    description: `Event: ${arg.event.title} \n Datum: ${arg.event.start} \n Bestätigt: ${
      arg.event.extendedProps.confirmed ? 'Ja' : 'Nein'
    }`
  })
}

defineProps({
  arg: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="w-full h-full"
    :class="cn(arg.event.extendedProps.confirmed && 'event-confirmed')"
    @click="eventClick(arg)"
  >
    <template v-if="arg.view.type == 'dayGridFourWeek'">
      <div class="relative" v-if="arg.event.allDay">
        <a
          :class="
            cn('cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block', arg.isPast && 'fc-event-past')
          "
        >
          <div class="flex">
            <div class="ms-0.5">
              {{ arg.event.title }}
            </div>
            <div class="flex-grow" />
            <ConfirmationIcon :confirmed="arg.event.extendedProps.confirmed" />
          </div>
        </a>
      </div>
      <div class="relative" v-else>
        <a
          :class="
            cn(
              'decoration-0 cursor-pointer fc-event-resizable mx-0.5 fc-daygrid-event py-0.5 flex items-center',
              arg.isPast && 'fc-event-past'
            )
          "
        >
          <div class="fc-daygrid-event-dot"></div>
          <div class="me-1">{{ arg.timeText }}</div>
          <div class="overflow-hidden">{{ arg.event.title }}</div>
          <div class="flex-grow" />
          <div class="me-[1px]">
            <ConfirmationIcon :confirmed="arg.event.extendedProps.confirmed" />
          </div>
        </a>
      </div>
    </template>
    <template v-else-if="arg.view.type == 'timeGridDay'">
      <div class="relative" v-if="arg.event.allDay">
        <a
          :class="
            cn('cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block', arg.isPast && 'fc-event-past')
          "
        >
          <div class="flex">
            <div class="ms-0.5">
              {{ arg.event.title }}
            </div>
            <div class="flex-grow" />
            <ConfirmationIcon :confirmed="arg.event.extendedProps.confirmed" />
          </div>
        </a>
      </div>
      <div v-else>
        <div class="flex">
          <div>
            <div>
              {{ arg.timeText }}
            </div>
            {{ arg.event.title }}
          </div>
          <div class="flex-grow" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PencilIcon :size="20" class="me-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>You can edit this event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ConfirmationIcon :confirmed="arg.event.extendedProps.confirmed" />
        </div>
      </div>
      <!--      <div v-else>-->
      <!--        <div-->
      <!--          class="fc-timegrid-event-harness fc-timegrid-event-harness-inset"-->
      <!--          style="inset: 850px 0% -975px; z-index: 1"-->
      <!--        >-->
      <!--          <a class="fc-event fc-event-draggable fc-event-resizable mx-0.5 fc-event-past fc-timegrid-event fc-v-event"-->
      <!--            ><div class="fc-event-main text-red-500">-->
      <!--              <div class="fc-event-main-frame">-->
      <!--                <div class="fc-event-time">{{ arg.timeText }}</div>-->
      <!--                <div class="fc-event-title-container"><div class="fc-event-title fc-sticky">Frederic Abraham</div></div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <div class="fc-event-resizer fc-event-resizer-end"></div-->
      <!--          ></a>-->
      <!--        </div>-->
      <!--      </div>-->
    </template>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.fc-daygrid-event-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: hsl(var(--primary));
  border-radius: 50%;
  margin-right: 0.5rem;
  border: none;
}

.fc-event {
  &:hover {
    cursor: pointer;
  }
}

.fc-daygrid-block-event,
.fc-timegrid-event {
  background: var(--primary-rgb);
  border: var(--primary-rgb) solid 0px;
  padding: 1px;
  color: hsl(var(--primary-foreground)) !important;

  &:hover {
    filter: brightness(95%);
  }
}

.fc-v-event .fc-event-main {
  padding: 0.25rem;
  color: hsl(var(--primary-foreground));
}
</style>
