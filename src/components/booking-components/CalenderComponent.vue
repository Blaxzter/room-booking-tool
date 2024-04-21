<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timeGrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ref } from 'vue'
import { type CalendarOptions } from '@fullcalendar/core'
import CalenderRemote from '@/components/booking-components/CalenderRemote.vue'

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  headerToolbar: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  height: '100%',
  initialView: 'dayGridFourWeek',
  views: {
    dayGridFourWeek: {
      type: 'dayGrid',
      duration: { weeks: 5 }
    }
  },
  eventColor: '#378006',
  todayColor: '#378006'
} as CalendarOptions

const fullCalenderRef = ref(null)
</script>

<template>
  <Card class="calender-content">
    <card-header class="flex flex-row items-center justify-between">
      <h2 class="text-2xl">Booking Calendar</h2>
      <calender-remote
        @toggle-day-view="
          $refs.fullCalenderRef.getApi().changeView('dayGridFourWeek')
        "
        @toggle-time-view="
          $refs.fullCalenderRef.getApi().changeView('timeGridWeek')
        "
        @toggle-list-view="
          $refs.fullCalenderRef.getApi().changeView('listWeek')
        "
      />
    </card-header>
    <CardContent class="calender-wrapper">
      <full-calendar :options="calendarOptions" ref="fullCalenderRef" />
    </CardContent>
  </Card>
</template>

<style>
.calender-content {
  height: calc(100vh - 4rem);
  max-height: calc(100vh - 4rem);

  @media (min-width: 1024px) {
    max-height: calc(100vh - 4rem);
  }

  .calender-wrapper {
    height: calc(100% - 2rem);
    max-height: calc(100% - 5rem);
  }
}

.fc-day-today {
  background: #1e293b !important;
  border: none !important;
}

.fc .fc-list-empty {
  background: #1e293b;
}
</style>
