<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import StepperComponent from '@/components/utils/StepperComponent.vue'
import ContactData from '@/components/booking-components/booking-request-dialog/ContactData.vue'
import EventData from '@/components/booking-components/booking-request-dialog/EventData.vue'
import TimeData from '@/components/booking-components/booking-request-dialog/TimeData.vue'
import { useBooking } from '@/stores/useBooking'
import type { CreateBookingRequest } from '@/assets/ts/queries/bookings'

const activeStep = ref(0)
const steps = ['Basic Info', 'Permissions', 'Additional', 'Details']

const contactData = ref()
const eventData = ref()
const timeData = ref()
const open = defineModel<boolean>()

const props = defineProps<{
  startDate: string
  startTime: string
  endTime: string
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

const emit = defineEmits(['dismiss', 'close'])

const handleDismiss = () => {
  open.value = false
  emit('dismiss')
}

const handleClose = () => {
  emit('close')
}

const createBooking = async () => {
  const createObject = {
    ...stepToValues.value[0],
    ...stepToValues.value[1],
    ...stepToValues.value[2]
  }

  console.log('Creating object with values:', createObject)
  const { createBookings } = useBooking()
  await createBookings(createObject as CreateBookingRequest)
}

const nextStep = async () => {
  const valRes = await stepRefMap[activeStep.value].value.validate()
  console.log('Validation result:', valRes)
  if (valRes.valid) {
    stepToValues.value[activeStep.value] = valRes.values
    if (activeStep.value < steps.length - 1) activeStep.value++
    else {
      await createBooking()
      // open.value = false
    }
  }
}

watch(open, (val) => {
  console.log('Open changed:', val)
  if (val) {
    console.log('Resetting values')
    activeStep.value = 0
    stepToValues.value[0] = {
      startDate: props.startDate,
      startTime: props.startTime,
      endTime: props.endTime
    }
  }
})
</script>

<template>
  <Dialog v-model:open="open" @close="handleClose" @dismiss="handleDismiss">
    <DialogContent :trap-focus="true">
      <DialogHeader class="mb-2">
        <DialogTitle class="fade-transition"> Create a Booking </DialogTitle>
      </DialogHeader>
      <StepperComponent v-model="activeStep" :steps="steps">
        <template v-slot:step-0>
          <TimeData ref="timeData" :initial-values="stepToValues[0]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="nextStep" type="button">Next</Button>
              </DialogFooter>
            </template>
          </TimeData>
        </template>
        <template v-slot:step-1>
          <ContactData ref="contactData" :initial-values="stepToValues[1]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep--" type="button">Back</Button>
                <Button @click="nextStep" type="button">Create</Button>
              </DialogFooter>
            </template>
          </ContactData>
        </template>
        <template v-slot:step-2>
          <EventData ref="eventData" :initial-values="stepToValues[2]">
            <template v-slot:footer>
              <DialogFooter>
                <Button @click="activeStep--" type="button">Back</Button>
                <Button @click="nextStep" type="button">Next</Button>
              </DialogFooter>
            </template>
          </EventData>
        </template>
      </StepperComponent>
    </DialogContent>
  </Dialog>
</template>
