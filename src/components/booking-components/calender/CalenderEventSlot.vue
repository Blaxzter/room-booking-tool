<script setup lang="ts">
import { defineProps } from 'vue'
import { cn } from '@/lib/utils'

import { useToast } from '@/components/ui/toast'

import ConfirmationIcon from '@/components/booking-components/calender/ConfirmationIcon.vue'

const { toast } = useToast()

defineProps({
  arg: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="w-full"
    @click="
      toast({
        title: 'Clicked',
        description: JSON.stringify(arg)
      })
    "
  >
    <template v-if="arg.view.type == 'dayGridFourWeek'">
      <div class="relative" v-if="arg.event.allDay">
        <a
          :class="
            cn(
              'fc-event cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block',
              arg.isPast && 'fc-event-past',
              arg.event.extendedProps.confirmed && 'bg-primary text-primary-foreground'
            )
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
            cn(
              'fc-event cursor-pointer mx-0.5 fc-daygrid-event fc-daygrid-block-event block',
              arg.isPast && 'fc-event-past',
              arg.event.extendedProps.confirmed && 'bg-primary text-primary-foreground'
            )
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
        {{ arg }}
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

<style>
.fc-daygrid-event-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: hsl(var(--primary));
  border-radius: 50%;
  margin-right: 0.5rem;
  border: none;
}

.fc-daygrid-block-event {
  background: hsl(var(--primary));
  border: hsl(var(--primary)) solid 1px;
  color: hsl(var(--primary-foreground)) !important;
}

.fc-v-event {
  background: hsl(var(--primary)) !important;
  border: hsl(var(--primary)) solid 1px;
  padding: 0.25rem;
  .fc-event-main {
    color: hsl(var(--primary-foreground)) !important;
  }
}
</style>
