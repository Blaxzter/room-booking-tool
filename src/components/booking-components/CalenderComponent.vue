<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timeGrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

import { CalendarIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { computed, onMounted, ref } from 'vue'
import { type CalendarOptions } from '@fullcalendar/core'
import CalenderTabs, { type CalendarViewType } from '@/components/booking-components/CalenderTabs.vue'
import CalenderRemote from '@/components/booking-components/CalenderRemote.vue'
import dayjs from 'dayjs'
import BookingRequestDialog from '@/components/booking-components/BookingRequestDialog.vue'
import { EventImpl } from '@fullcalendar/core/internal'

const fullCalenderRef = ref<InstanceType<typeof FullCalendar>>()

const fullCalenderApi = () => fullCalenderRef.value!.getApi()
const fullCalenderData = () => fullCalenderApi().getCurrentData()

const selectedDay = ref<dayjs.Dayjs | undefined>(undefined)
const selectedTab = ref<CalendarViewType>('dayGridFourWeek')
const currentDateString = ref<string | undefined>('')

const openEventDialog = ref(false)
const openEventProps = ref({})
const createdTempEvent = ref<EventImpl | null>(null)

const calendarOptions = {
  timeZone: 'UTC',
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
      allDay: arg.allDay
    })
    openEventDialog.value = true
    openEventProps.value = arg
  }
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

const dismissTempEvent = () => {
  createdTempEvent.value?.remove()
  openEventDialog.value = false
}

const closeDialog = () => {
  openEventDialog.value = false
}

// computed that is true if selected date is today with day js
const isToday = computed(() => {
  return selectedDay.value?.isToday()
})

onMounted(() => {
  currentDateString.value = fullCalenderData().viewTitle
  selectedDay.value = dayjs(fullCalenderData().currentDate)
})
</script>

<template>
  <Card class="calender-content">
    <card-header class="flex flex-row items-center">
      <CalendarIcon class="me-2" />
      <h2 class="text-lg font-semibold" v-if="fullCalenderRef">
        {{ currentDateString }}
      </h2>
      <div class="flex-grow" />
      <Button @click="selectToday" class="me-3" :variant="isToday ? 'outline' : 'default'"> Today </Button>
      <calender-remote class="me-3" @prev="togglePrev" @next="toggleNext" />
      <calender-tabs v-model="selectedTab" @update:model-value="switchTab" />
    </card-header>
    <CardContent class="calender-wrapper">
      <full-calendar :options="calendarOptions" ref="fullCalenderRef" />
    </CardContent>
  </Card>
  <booking-request-dialog
    v-model="openEventDialog"
    :args="openEventProps"
    @close="closeDialog"
    @dismiss="dismissTempEvent"
  />
</template>

<style>
.calender-content {
  height: calc(100vh - 2rem);
  max-height: calc(100vh - 2rem);

  @media (min-width: 1024px) {
    max-height: calc(100vh - 2rem);
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
  height: calc((100vh - 15rem) / 4);
  &:hover {
    background: hsl(var(--secondary));
    cursor: pointer;

    .fc-daygrid-day-top {
      text-decoration: underline;
    }
  }
}
</style>
