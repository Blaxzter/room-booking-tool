<script setup lang="ts">
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, defineProps, onMounted, ref } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timeGrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { type CalendarOptions } from '@fullcalendar/core'

import { EventImpl } from '@fullcalendar/core/internal'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CalenderRemote from '@/components/booking-components/calender/CalenderRemote.vue'
import CalenderTabs, { type CalendarViewType } from '@/components/booking-components/calender/CalenderTabs.vue'

import BookingRequestWrapper from '@/components/booking-components/booking-request-dialog/BookingRequestWrapper.vue'
import { useBooking } from '@/stores/useBooking'
import type { Booking } from '@/types'

const { currentBookings } = storeToRefs(useBooking())

const fullCalenderRef = ref<InstanceType<typeof FullCalendar>>()

const fullCalenderApi = () => fullCalenderRef.value!.getApi()
const fullCalenderData = () => fullCalenderApi().getCurrentData()

const selectedDay = ref<dayjs.Dayjs | undefined>(undefined)
const selectedTab = ref<CalendarViewType>('dayGridFourWeek')
const currentDateString = ref<string | undefined>('')

const openEventDialog = ref(false)
const openEventProps = ref({})
const createdTempEvent = ref<EventImpl | null>(null)

const props = defineProps({
  topPadding: { type: Number, default: 0 }
})

const startDate = ref('')
const startTime = ref('')
const endTime = ref('')
const allDay = ref(false)

const bookingToEvent = (booking: Booking) => {
  return {
    id: booking.id,
    title: booking.display_name,
    start: booking.start_date,
    end: booking.end_date,
    confirmed: booking.confirmed
  }
}

const fullCalenderInitialEvents = currentBookings.value.map((booking) => {
  return bookingToEvent(booking)
})

const calendarOptions = {
  timeZone: 'local',
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  headerToolbar: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: false,
  weekends: true,
  height: '100%',
  initialView: 'dayGridFourWeek',
  firstDay: 1,
  views: {
    dayGridFourWeek: {
      type: 'dayGrid',
      duration: { weeks: 4 },
      selectable: false,
      dateClick(arg) {
        fullCalenderApi().gotoDate(arg.date)
        fullCalenderApi().changeView('timeGridDay')
        selectedTab.value = 'timeGridDay'
        currentDateString.value = fullCalenderData().viewTitle
        selectedDay.value = dayjs(fullCalenderData().currentDate)
      }
    }
  },
  select(arg) {
    createdTempEvent.value = fullCalenderApi().addEvent({
      title: 'New Event',
      start: arg.start,
      end: arg.end,
      allDay: arg.allDay,
      confirmed: false
    })
    startDate.value = dayjs(arg.start).format('YYYY-MM-DD')
    startTime.value = dayjs(arg.start).format('HH:mm')
    endTime.value = dayjs(arg.end).format('HH:mm')
    allDay.value = arg.allDay
    openEventDialog.value = true
    openEventProps.value = arg
  },
  initialEvents: fullCalenderInitialEvents
} as CalendarOptions

const switchTab = (tab: CalendarViewType) => {
  fullCalenderApi().changeView(tab)
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)
}

const togglePrev = () => {
  fullCalenderApi().prev()
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)
}

const toggleNext = () => {
  fullCalenderApi().next()
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)
}

const selectToday = () => {
  fullCalenderApi().today()
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)
}

const addEvent = (event: Booking) => {
  console.log('Adding event', event)
  fullCalenderApi().addEvent(bookingToEvent(event))
  openEventDialog.value = false
}

const dismissTempEvent = () => {
  console.log('dismiss')
  createdTempEvent.value?.remove()
  openEventDialog.value = false
}

const closeDialog = () => {
  console.log('Closing dialog')
  createdTempEvent.value?.remove()
  openEventDialog.value = false
}

// computed that is true if selected date is today with day js
const isToday = computed(() => {
  return selectedDay.value?.isToday()
})

const styleProps = computed(() => {
  return `--top-padding: ${props.topPadding}px`
})

onMounted(() => {
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)

  console.log(currentBookings.value)
})

// setTimeout(() => window.dispatchEvent(new Event('resize')), 20)
</script>

<template>
  <Card class="calender-content" :style="styleProps">
    <card-header class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
      <div class="flex items-center">
        <CalendarIcon class="mr-2" />
        <h2 class="text-lg font-semibold" v-if="fullCalenderRef">
          {{ currentDateString }}
        </h2>
      </div>
      <div class="flex-grow"></div>
      <div class="flex items-center space-x-3">
        <Button @click="selectToday" :variant="isToday ? 'outline' : 'default'">Today</Button>
        <calender-remote @prev="togglePrev" @next="toggleNext" />
        <calender-tabs v-model="selectedTab" @update:model-value="switchTab" />
      </div>
    </card-header>
    <CardContent class="calender-wrapper">
      <full-calendar :options="calendarOptions" ref="fullCalenderRef">
        <!--        <template v-slot:eventContent="arg">-->
        <!--          <div class="flex">-->
        <!--            <CheckIcon class="me-2" v-if="arg.extendedProps.extendedProps.confirmed" />-->
        <!--            {{ arg }}-->
        <!--            <b>{{ arg.event.title }}</b>-->
        <!--          </div>-->
        <!--        </template>-->
      </full-calendar>
    </CardContent>
  </Card>
  <booking-request-wrapper
    v-model="openEventDialog"
    :start-date="startDate"
    :start-time="startTime"
    :end-time="endTime"
    :all-day="allDay"
    @close="closeDialog"
    @dismiss="dismissTempEvent"
    @created="addEvent"
  />
</template>

<style lang="scss">
:root {
  --top-padding: 0;
}

.calender-content {
  width: 100% !important;
  height: calc(100vh - 2rem - var(--top-padding));
  max-height: calc(100vh - 2rem - var(--top-padding));

  @media (min-width: 1024px) {
    max-height: calc(100vh - 2rem - var(--top-padding));
  }

  .calender-wrapper {
    height: calc(100% - 5rem);
    max-height: calc(100% - 5rem);
  }
}

.fc-day-today {
  background: hsl(var(--secondary)) !important;
  border: none !important;
}

.fc .fc-list-empty {
  background: hsl(var(--secondary));
}

/* Event colors */
.fc-v-event {
  background: hsl(var(--primary));
  border: hsl(var(--primary-foreground)) solid 1px;
  padding: 0.25rem;
  .fc-event-main {
    color: hsl(var(--primary-foreground)) !important;
  }
}

.fc-daygrid-day {
  //height: calc((100vh - 15rem) / 4);
  &:hover {
    background: hsl(var(--secondary));
    cursor: pointer;

    .fc-daygrid-day-top {
      text-decoration: underline;
    }
  }
}

.fc-col-header,
.fc-timegrid-body {
  width: 100% !important;
}
.fc-scrollgrid-sync-table {
  width: 100% !important;
}
.fc-daygrid-body {
  width: 100% !important;
}
.fc-daygrid-body-balanced {
  width: 100% !important;
}
</style>
