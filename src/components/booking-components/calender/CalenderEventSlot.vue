<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { cn } from '@/lib/utils'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import { PencilIcon, HistoryIcon } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'

import ConfirmationIcon from '@/components/booking-components/calender/ConfirmationIcon.vue'
import { useUser } from '@/stores/user'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import EditEvent from '@/components/booking-components/EditEvent.vue'
import { useLocalUser } from '@/stores/localUser'
const { t } = useI18n()
const { user } = storeToRefs(useUser())

const { toast } = useToast()

const selectedEvent = ref(undefined)

const eventClick = (arg: any) => {
  // Save the isPast value to show in the toast
  const isPast = arg.isPast
  
  const { userHasCreatedBooking } = useLocalUser()
  const canEdit = userHasCreatedBooking(arg.event.extendedProps.booking_id)

  console.log(canEdit)

  // If no user or past event, just show toast
  if (!canEdit && (user.value === null || Object.keys(user.value).length === 0 || isPast)) {
    toast({
      title: t('bookingComponents.calender.calenderEventSlot.eventData'),
      description: `${t('bookingComponents.calender.calenderEventSlot.event')}: ${arg.event.title} \n ${t('bookingComponents.calender.calenderEventSlot.date')}: ${arg.event.start} \n ${t('bookingComponents.calender.calenderEventSlot.confirmed')}: ${
        arg.event.extendedProps.confirmed ? t('bookingComponents.calender.calenderEventSlot.yes') : t('bookingComponents.calender.calenderEventSlot.no')
      }`
    })
  } else {
    // Just pass the event data
    console.log(arg.event.extendedProps)
    selectedEvent.value = arg.event.extendedProps
  }
}

const props = defineProps({
  arg: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const event = computed(() => {
  return props.arg.event.extendedProps
})

const confirmed = ref(false)

const closeDialog = () => {
  selectedEvent.value = undefined
}

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobile = breakpoints.smallerOrEqual('md')

onMounted(() => {
  confirmed.value = event.value.confirmed
})
</script>

<template>
  <div class="w-full h-full" :class="cn(confirmed && 'event-confirmed')" @click="eventClick(arg)">
    <template v-if="arg.view.type == 'dayGridFourWeek'">
      <div class="relative" v-if="arg.event.allDay">
        <a
          class="cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block"
          :class="[arg.isPast && 'fc-event-past']"
        >
          <div class="flex">
            <div class="ms-0.5">
              {{ arg.event.title }}
            </div>
            <div class="flex-grow" />
            <ConfirmationIcon :confirmed="confirmed" />
          </div>
        </a>
      </div>
      <div class="relative" v-else>
        <a
          class="decoration-0 cursor-pointer fc-event-resizable fc-daygrid-event lg:mx-0.5 lg:py-0.5 flex items-center"
          :class="[arg.isPast && 'fc-event-past', !confirmed && 'text-muted-foreground', mobile && 'event-mobile']"
        >
          <div
            class="fc-daygrid-event-dot"
            :class="[confirmed && 'confirmed', !confirmed && 'not-confirmed']"
            v-if="!mobile"
          ></div>
          <div class="overflow-hidden flex-shrink overflow-ellipsis">{{ arg.event.title }}</div>
          <div class="flex-grow" />
          <template v-if="!arg.isPast">
            <div class="me-[1px]" v-if="!mobile">
              <ConfirmationIcon :confirmed="confirmed" />
            </div>
          </template>
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
            <div v-if="arg.isPast">{{ t('bookingComponents.calender.calenderEventSlot.pastEvent') }}</div>
            <div class="flex-grow" />
            <template v-if="!arg.isPast">
              <TooltipProvider v-if="false">
                <Tooltip>
                  <TooltipTrigger>
                    <PencilIcon :size="mobile ? 15 : 20" class="me-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ t('bookingComponents.calender.calenderEventSlot.canEdit') }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ConfirmationIcon :confirmed="confirmed" :size="mobile ? 15 : 20" class="me-3" />
            </template>
          </div>
        </a>
      </div>
      <div v-else>
        <div class="flex pe-2">
          <div>
            <div>
              {{ arg.timeText }}
            </div>
            {{ arg.event.title }}
          </div>
          <div class="flex-grow" />
          <template v-if="!arg.isPast">
            <TooltipProvider v-if="false">
              <Tooltip>
                <TooltipTrigger>
                  <PencilIcon :size="mobile ? 15 : 20" class="me-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ t('bookingComponents.calender.calenderEventSlot.canEdit') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ConfirmationIcon :confirmed="confirmed" :size="mobile ? 15 : 20" />
          </template>
          <template v-else>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HistoryIcon :size="mobile ? 15 : 20" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ t('bookingComponents.calender.calenderEventSlot.isPast') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </template>
        </div>
      </div>
    </template>
    <template v-else-if="arg.view.type == 'timeGridWeek'">
      <div class="relative" v-if="arg.event.allDay">
        <a
          :class="
            cn('cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block', arg.isPast && 'fc-event-past')
          "
        >
          <div class="flex">
            <div class="ms-0 sm:ms-0.5 break-all">
              {{ arg.event.title }}
            </div>
            <div class="flex-grow" />
            <div class="flex" v-if="!arg.isPast">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <PencilIcon :size="mobile ? 15 : 20" class="sm:me-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ t('bookingComponents.calender.calenderEventSlot.canEdit') }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ConfirmationIcon :confirmed="confirmed" :size="mobile ? 15 : 20" />
            </div>
          </div>
        </a>
      </div>
      <div v-else class="h-full overflow-hidden">
        <div class="flex flex-col h-full">
          <div class="ms-0 sm:ms-0.5 break-all line-clamp-2">
            {{ arg.event.title }}
          </div>
          <div class="flex-grow" />
          <div class="flex" v-if="!arg.isPast">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PencilIcon :size="mobile ? 15 : 20" class="sm:me-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ t('bookingComponents.calender.calenderEventSlot.canEdit') }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ConfirmationIcon :confirmed="confirmed" :size="mobile ? 13 : 20" />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="arg.view.type == 'listWeek'">
      <div class="flex cursor-pointer" :class="[arg.isPast && 'fc-event-past']">
        <div class="ms-0.5 line-clamp-1">
          {{ arg.event.title }}
        </div>
        <div class="flex-grow" />
        <template v-if="!arg.isPast">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PencilIcon :size="20" class="sm:me-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ t('bookingComponents.calender.calenderEventSlot.canEdit') }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ConfirmationIcon :confirmed="confirmed" />
        </template>
      </div>
    </template>
    <EditEvent
      v-if="selectedEvent"
      :event="selectedEvent"
      @close="closeDialog"
      @delete="
        () => {
          emit('delete', event.booking_id)
          closeDialog()
        }
      "
    />
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.fc-daygrid-event-dot {
  width: 0.5rem;
  height: 0.5rem;
  min-width: 0.5rem;
  min-height: 0.5rem;
  background: hsl(var(--primary));
  border-radius: 50%;
  margin-right: 0.5rem;
  border: none;

  &.confirmed {
    background: hsl(var(--success));
  }

  &.not-confirmed {
    background: hsl(var(--destructive));
  }

  @media (max-width: 768px) {
    display: none;
  }
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

  &.fc-event-past {
    // make it a bit transparent
    filter: brightness(50%);
  }
}

.fc-timeGridWeek-view .fc-daygrid-body table tbody tr:first-child,
.fc-timeGridDay-view .fc-daygrid-body table tbody tr:first-child {
  height: 80px !important;
  max-height: 80px !important;
  overflow: hidden;

  td {
    height: 80px !important;
    max-height: 80px !important;
  }
}

.fc-v-event .fc-event-main {
  padding: 0.25rem;
  color: hsl(var(--primary-foreground));
}

.event-mobile {
  padding: 0 !important;
  margin: 0 !important;
}

// mobile view
@media (max-width: 768px) {
  .fc-daygrid-day-events {
    min-height: 0 !important;

    .fc-event {
      padding: 0.25px 0 !important;
      margin: 0.25px 0 !important;
      font-size: 0.75rem;
    }

    .fc-daygrid-more-link.fc-more-link {
      font-size: 0.75rem !important;
      padding: 2px 0 !important;
      margin: 0.25px 0 !important;
    }
  }

  .fc-daygrid-day-top {
    font-size: 0.75rem;
  }

  .fc-daygrid-month-start {
    // remove bold
    font-weight: 400 !important;
  }

  .fc-list-event {
    font-size: 0.75rem;
  }
}

.fc-list-day-cushion.fc-cell-shaded {
  color: hsl(var(--primary-foreground));
}

.fc-event.fc-event-start.fc-event-end.fc-list-event {
  padding: 1px;
  color: hsl(var(--foreground)) !important;

  &:hover {
    color: hsl(var(--primary-foreground)) !important;
    background-color: hsl(var(--primary)) !important;
  }
}
</style>
