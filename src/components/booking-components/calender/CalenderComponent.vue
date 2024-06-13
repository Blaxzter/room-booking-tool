<script setup lang="ts">
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { type CalendarOptions } from '@fullcalendar/core'

import { EventImpl } from '@fullcalendar/core/internal'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CalenderRemote from '@/components/booking-components/calender/CalenderRemote.vue'

import CalenderTabs, { type CalendarViewType } from '@/components/booking-components/calender/CalenderTabs.vue'

import BookingRequestWrapper from '@/components/booking-components/booking-request-dialog/BookingRequestWrapper.vue'
import { useBookings } from '@/stores/booking'
import type { Booking } from '@/types'
import CalenderEventSlot from '@/components/booking-components/calender/CalenderEventSlot.vue'

const { currentBookings } = storeToRefs(useBookings())

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
  topPadding: { type: Number, default: 0 },
  date: { type: String, default: '' }
})

const startDate = ref('')
const startTime = ref('')
const endTime = ref('')
const allDay = ref(false)

const bookingToEvent = ({ booking, editable = false }: { booking: Booking; editable?: boolean }) => {
  let start_date = booking.start_date
  let end_date = booking.end_date
  if (booking.is_full_day) {
    start_date = booking.start_date.split('T')[0]
    end_date = booking.end_date.split('T')[0]
  }

  return {
    ...booking,
    id: booking.id,
    title: booking.display_name,
    start: start_date,
    end: end_date,
    confirmed: booking.confirmed,
    // editable stuff,
    editable: editable,
    startEditable: editable,
    resourceEditable: editable,
    durationEditable: editable
  }
}

const fullCalenderInitialEvents = currentBookings.value.map((booking) => {
  return bookingToEvent({ booking })
})

const calendarOptions = {
  timeZone: 'local',
  locale: 'en',
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  headerToolbar: false,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: false,
  weekends: true,
  height: '100%',
  initialView: 'dayGridFourWeek',
  firstDay: 1,
  nowIndicator: true,
  nowIndicatorClassNames: ['now-indicator'],
  axisFormat: 'HH:mm',
  minTime: 0,
  maxTime: 24,
  eventStartEditable: false,
  eventEndEditable: false,
  timeFormat: {
    agenda: 'H:mm{ - h:mm}'
  },
  defaultEventMinutes: 120,
  views: {
    dayGridFourWeek: {
      type: 'dayGrid',
      duration: { weeks: 4 },
      selectable: false,
      timeFormat: 'H(:mm)',
      dateClick(arg) {
        fullCalenderApi().gotoDate(arg.date)
        fullCalenderApi().changeView('timeGridDay')
        selectedTab.value = 'timeGridDay'
        currentDateString.value = fullCalenderData().viewTitle
        selectedDay.value = dayjs(fullCalenderData().currentDate)
        const now = dayjs()
        console.log('Scrolling to now', now.format('HH:mm:ss'))
        fullCalenderApi().scrollToTime(now.format('HH:mm:ss'))
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

  console.log('Switching tab', tab)
  if (tab === 'timeGridWeek' || tab === 'timeGridDay') {
    const now = dayjs()
    console.log('Scrolling to now', now.format('HH:mm:ss'))
    fullCalenderApi().scrollToTime(now.format('HH:mm:ss'))
  }
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
  fullCalenderApi().addEvent(bookingToEvent({ booking: event, editable: true }))
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

  // if date is passed, go to that date
  if (props.date) {
    fullCalenderApi().gotoDate(props.date)
    // get data-date="2024-07-18" from the dom and add class for highlighting
    // get date without time of props.date
    const date = dayjs(props.date).format('YYYY-MM-DD')
    const dayElement = document.querySelector(`[data-date="${date}"]`)
    if (dayElement) {
      dayElement.classList.add('fc-day-highlight')
    }
  }

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
        <template v-slot:eventContent="arg">
          <CalenderEventSlot :arg="arg" />
        </template>
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

.fc-day-highlight {
  background: hsl(var(--secondary)) !important;
  // create a inset border
  box-shadow: inset 0 0 0 2px var(--primary-color-rgb);
}

.fc .fc-list-empty {
  background: hsl(var(--secondary));
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
