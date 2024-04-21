<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timeGrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

import { CalendarIcon } from 'lucide-vue-next'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { onMounted, ref } from 'vue'
import { type CalendarOptions } from '@fullcalendar/core'
import CalenderTabs, {
  type CalendarViewType
} from '@/components/booking-components/CalenderTabs.vue'
import CalenderRemote from '@/components/booking-components/CalenderRemote.vue'

const fullCalenderRef = ref<InstanceType<typeof FullCalendar>>()

const fullCalenderApi = () => fullCalenderRef.value!.getApi()

const selectedTab = ref<CalendarViewType>('dayGridFourWeek')

const currentDateString = ref<string | undefined>('')

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
      duration: { weeks: 4 },
      selectable: false,
      dateClick(arg) {
        fullCalenderApi().gotoDate(arg.date)
        fullCalenderApi().changeView('timeGridDay')
        selectedTab.value = 'timeGridDay'
        currentDateString.value = fullCalenderRef
          .value!.getApi()
          .getCurrentData().viewTitle
      }
    }
  }
} as CalendarOptions

const switchTab = (tab: CalendarViewType) => {
  console.log(tab)
  fullCalenderApi().changeView(tab)
  currentDateString.value = fullCalenderRef.value
    ?.getApi()
    .getCurrentData().viewTitle
}

const togglePrev = () => {
  fullCalenderApi().prev()
  currentDateString.value = fullCalenderApi().getCurrentData().viewTitle
}

const toggleNext = () => {
  fullCalenderApi().next()
  currentDateString.value = fullCalenderApi().getCurrentData().viewTitle
}

onMounted(() => {
  currentDateString.value = fullCalenderApi().getCurrentData().viewTitle
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
      <calender-remote class="me-3" @prev="togglePrev" @next="toggleNext" />
      <calender-tabs v-model="selectedTab" @update:model-value="switchTab" />
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

.fc-day.fc-day-future.fc-daygrid-day {
  &:hover {
    background: #1e293b;
    cursor: pointer;

    .fc-daygrid-day-top {
      text-decoration: underline;
    }
  }
}
</style>
