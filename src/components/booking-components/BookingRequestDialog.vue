<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone } from 'lucide-vue-next'

import { computed, ref } from 'vue'
import { type Booking, BookingImpl } from '@/types'
import dayjs from 'dayjs'

const dialogOpen = defineModel<boolean>()
const props = defineProps<{ args: any }>()
const emit = defineEmits(['dismiss', 'close'])

const eventCreated = ref(false)

const booking = ref<Booking>(BookingImpl)

const startTime = computed(() => {
  return dayjs(props.args.startTime).format('HH:mm')
})

const endTime = computed(() => {
  return dayjs(props.args.endTime).format('HH:mm')
})

const startDate = computed(() => {
  return dayjs(props.args.startDate).format('DD.MM.YYYY')
})

const closeDialogDismiss = (state: boolean) => {
  if (!state && !eventCreated.value) {
    emit('dismiss')
  }
}

const createBooking = () => {
  eventCreated.value = true
  dialogOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="dialogOpen" :modal="true" @update:open="closeDialogDismiss">
    <DialogContent class="sm:max-w-[425px]" :trap-focus="true">
      <DialogHeader>
        <DialogTitle>Room Booking</DialogTitle>
        <DialogDescription> Please provide the details for your room booking. </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="date" class="text-right"> Start Date </Label>
          <Input type="date" id="date" v-model="startDate" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="start-time" class="text-right"> Start Time </Label>
          <Input type="time" id="start-time" v-model:value="startTime" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="end-time" class="text-right"> End Time </Label>
          <Input type="time" id="end-time" v-model:value="endTime" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="contact-info" class="text-right"> E-Mail </Label>
          <div class="relative max-w-sm items-center col-span-3">
            <Input id="contact-info" v-model="booking.mail" class="pl-10" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <Mail class="size-6 text-muted-foreground" />
            </span>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="contact-info" class="text-right"> E-Mail </Label>
          <div class="relative max-w-sm items-center col-span-3">
            <Input id="contact-info" v-model="booking.phone" class="pl-10" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <Phone class="size-6 text-muted-foreground" />
            </span>
          </div>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right"> Description </Label>
          <Textarea id="description" v-model="booking.description" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="confirm-booking" class="text-right"> Confirm Booking </Label>
          <Checkbox id="confirm-booking" v-model="booking.confirmed" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button @click="createBooking"> Book Room </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
