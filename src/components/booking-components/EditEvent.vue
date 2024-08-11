<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'

// import icons
import { CheckIcon, TrashIcon, LoaderIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { useUser } from '@/stores/user'
import { useRequests } from '@/stores/requests'
import type { Booking } from '@/types'
const { approveRequest, rejectRequest } = useRequests()
const { requestLoading } = storeToRefs(useRequests())
const { user } = storeToRefs(useUser())

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const props = defineProps({
  event: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['close'])

const open = ref(false)

const formattedDate = computed(() => {
  if (!props.event) return ''
  return new Date(props.event.start_date).toLocaleDateString()
})

const formattedTime = computed(() => {
  if (!props.event) return ''
  const startTime = new Date(props.event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(props.event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startTime} - ${endTime}`
})

const canConfirm = computed(() => {
  return true
})

const confirmEvent = async () => {
  await approveRequest({ id: props?.event?.booking_id, ...props.event } as Booking)
}

const deleteEvent = async () => {
  await rejectRequest({ id: props?.event?.booking_id, ...props.event } as Booking)
}

// watcher on event -> open dialog if event is set close if null
watch(
  () => props.event,
  (event) => {
    console.log(event)
    open.value = !!event
  }
)

watch(
  () => open.value,
  (isOpen) => {
    console.log(isOpen)
    if (!isOpen) emit('close')
  }
)
</script>

<template>
  <UseTemplate>
    <div class="px-4 flex gap-2 flex-col" v-if="event">
      <div>
        <div class="flex gap-3">
          <h3 class="text-md font-semibold">Status:</h3>
          <p :class="{ 'text-green-600': event.confirmed, 'text-red-600': !event.confirmed }">
            {{ event.confirmed ? 'Confirmed' : 'Not Confirmed' }}
          </p>
        </div>
        <div v-if="requestLoading" class="text-muted-foreground flex">
          <LoaderIcon class="w-4 h-4 me-2 text-muted-foreground animate-spin" />
          Loading...
        </div>
        <div v-else-if="canConfirm && !event.confirmed" class="flex gap-2 mt-2">
          <Button variant="outline" @click="confirmEvent">
            <CheckIcon class="w-4 h-4 me-2 text-green-500" />
            Confirm
          </Button>
          <Button variant="outline" @click="deleteEvent">
            <TrashIcon class="w-4 h-4 me-2 text-red-500" />
            Delete
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3 class="text-md font-semibold">Contact Information</h3>
        <div v-if="event.mail || event.phone" class="ps-3 flex flex-col gap-2 border-l-2 -mt-2.5 pt-2.5">
          <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.display_name">
            <Label class="text-muted-foreground">Name:</Label>
            <Input v-model="event.display_name" readonly />
          </div>
          <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.mail">
            <Label class="text-muted-foreground">Email:</Label>
            <Input v-model="event.mail" readonly type="email" />
          </div>
          <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.phone">
            <Label class="text-muted-foreground">Phone:</Label>
            <Input v-model="event.phone" readonly type="tel" />
          </div>
        </div>

        <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.description">
          <Label class="text-md font-semibold">Description</Label>
          <Textarea v-model="event.description" readonly />
        </div>
      </div>
    </div>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="open">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          Event on the {{ formattedDate }}
          <span v-if="!event?.is_full_day"> from {{ formattedTime }}</span>
          <b v-else>all day</b>
        </DialogTitle>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerContent class="max-h-screen">
      <DrawerHeader class="text-left">
        <DrawerTitle>
          Event on the {{ formattedDate }}
          <span v-if="!event?.is_full_day"> from {{ formattedTime }}</span>
          <b v-else>all day</b>
        </DrawerTitle>
      </DrawerHeader>
      <div class="max-h-[80%] overflow-y-auto">
        <GridForm />
      </div>
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline"> Cancel </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
