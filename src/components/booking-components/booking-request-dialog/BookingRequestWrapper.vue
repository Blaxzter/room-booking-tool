<script setup lang="ts">
import { ref, watch } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import type { CreateBookingRequest } from '@/assets/ts/queries/bookings'
import { useI18n } from 'vue-i18n'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

import StepperComponent from '@/components/utils/StepperComponent.vue'
import ContactData from '@/components/booking-components/booking-request-dialog/ContactData.vue'
import EventData from '@/components/booking-components/booking-request-dialog/EventData.vue'
import TimeData from '@/components/booking-components/booking-request-dialog/TimeData.vue'

import { useBookings } from '@/stores/booking'

const activeStep = ref(0)
const steps = ['Time', 'Contact', 'Event']

const contactData = ref()
const eventData = ref()
const timeData = ref()
const open = defineModel<boolean>()

const emit = defineEmits(['dismiss', 'close', 'created'])

const props = defineProps<{
  startDate?: string
  startTime?: string
  endTime?: string
  allDay?: boolean
}>()

const stepRefMap: Record<number, any> = {
  0: timeData,
  1: contactData,
  2: eventData
}

const stepToValues = ref<Record<number, any>>({
  0: {},
  1: {},
  2: {}
})

const { t } = useI18n()

const handleDismiss = () => {
  open.value = false
  emit('dismiss', true)
}

const handleClose = () => {
  emit('dismiss', true)
}

function combineDateTime(date: string, time: string) {
  // Extract the date part (ignoring the time part if present)
  const datePart = date.split('T')[0]
  // Combine date part with time, and add a 'Z' to indicate UTC if needed
  return `${datePart}T${time}:00.000Z`
}

const createBooking = async () => {
  const timeData = stepToValues.value[0]

  // convert start date + time to ISO string
  if (timeData.fullDate) {
    timeData.startDate = timeData.startDate.split('T')[0]
    timeData.endDate = timeData.endDate.split('T')[0]
  } else {
    timeData.start_date = combineDateTime(timeData.startDate, timeData.startTime)
    timeData.end_date = combineDateTime(timeData.endDate, timeData.endTime)
  }

  delete timeData.startTime
  delete timeData.endTime
  delete timeData.combineDateTime
  delete timeData.isFullDay

  const createObject = {
    ...timeData,
    ...stepToValues.value[1],
    ...stepToValues.value[2]
  }

  const { createBooking } = useBookings()
  try {
    const createdEvent = await createBooking(createObject as CreateBookingRequest)
    emit('created', createdEvent)
  } catch (error) {
    console.error(error)
  }
  open.value = false
}

const nextStep = async () => {
  const valid = await stepRefMap[activeStep.value].value.validate()
  const valRes = stepRefMap[activeStep.value].value.getValues()

  if (valid.valid) {
    stepToValues.value[activeStep.value] = valRes
    if (activeStep.value < steps.length - 1) activeStep.value++
    else {
      await createBooking()
      // open.value = false
    }
  }
}

watch(open, (val) => {
  if (val) {
    activeStep.value = 0
    stepToValues.value[0] = {
      startDate: props.startDate,
      startTime: props.startTime,
      endTime: props.endTime,
      isFullDay: props.allDay,
      isOnAnotherDate: false,
      endDate: props.startDate
    }
  } else {
    emit('close')
  }
})

const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <UseTemplate>
    <StepperComponent v-model="activeStep" :steps="[
      t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.steps.time'),
      t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.steps.contact'),
      t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.steps.event')
    ]">
      <template v-slot:step-0>
        <TimeData ref="timeData" :initial-values="stepToValues[0]">
          <template v-slot:footer>
            <DialogFooter>
              <Button @click="nextStep" type="button">{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.buttons.next') }}</Button>
            </DialogFooter>
          </template>
        </TimeData>
      </template>
      <template v-slot:step-1>
        <ContactData ref="contactData" :initial-values="stepToValues[1]">
          <template v-slot:footer>
            <DialogFooter>
              <Button @click="activeStep--" type="button">{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.buttons.back') }}</Button>
              <Button @click="nextStep" type="button">{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.buttons.next') }}</Button>
            </DialogFooter>
          </template>
        </ContactData>
      </template>
      <template v-slot:step-2>
        <EventData ref="eventData" :initial-values="stepToValues[2]">
          <template v-slot:footer>
            <DialogFooter>
              <Button @click="activeStep--" type="button">{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.buttons.back') }}</Button>
              <Button @click="nextStep" type="button">{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.buttons.create') }}</Button>
            </DialogFooter>
          </template>
        </EventData>
      </template>
    </StepperComponent>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="open" @close="handleClose" @dismiss="handleDismiss">
    <DialogContent :trap-focus="true" class="max-h-full overflow-y-auto">
      <DialogHeader class="mb-2">
        <DialogTitle class="fade-transition"> {{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.title') }} </DialogTitle>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open" @close="handleClose" @dismiss="handleDismiss">
    <DrawerContent class="max-h-screen">
      <DrawerHeader class="text-left">
        <DrawerTitle>{{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.drawer.title') }}</DrawerTitle>
        <DrawerDescription> {{ t('bookingComponents.bookingRequestDialog.bookingRequestWrapper.drawer.description') }} </DrawerDescription>
      </DrawerHeader>
      <div class="p-4 max-h-[60%] overflow-y-auto">
        <GridForm />
      </div>
    </DrawerContent>
  </Drawer>
</template>
