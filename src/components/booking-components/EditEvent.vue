<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

// import icons
import { CheckIcon, TrashIcon, LoaderIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { useRequests } from '@/stores/requests'
import { useGroups } from '@/stores/groups'
import type { Booking } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useLocalUser } from '@/stores/localUser'
import { useBookings } from '@/stores/booking'
import { useDialogStore } from '@/stores/dialog'

const { approveRequest, rejectRequest } = useRequests()
const { requestLoading } = storeToRefs(useRequests())
const { userHasCreatedBooking } = useLocalUser()
const { t } = useI18n()
const { deleteBookingBySecretKey } = useBookings()
const { selectedBookableObject } = storeToRefs(useBookableObjects())

// Reuse `form` section
const [UseTemplate, GridForm] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')

const props = defineProps({
  event: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['close', 'delete', 'confirmed'])

// Initialize open state based on whether event exists
const open = ref(!!props.event)

const formattedDate = computed(() => {
  if (!props.event) return ''
  return new Date(props.event.start_date).toLocaleDateString()
})

const roleValue = computed(() => {
  const { getUserRoleByBookableObject } = useGroups()
  return getUserRoleByBookableObject(undefined)
})

const roleRequiredForConfirmation = computed(() => {
  const { selectedBookableObject } = storeToRefs(useBookableObjects())
  if (!selectedBookableObject.value) return 4

  switch (selectedBookableObject.value.confirm_role) {
    case 'admin':
      return 3
    case 'member':
      return 2
    default:
      return 4
  }
})

const formattedTime = computed(() => {
  if (!props.event) return ''
  const startTime = new Date(props.event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endTime = new Date(props.event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startTime} - ${endTime}`
})

const canConfirm = computed(() => {
  // check in route if meta.publicView is true -> return false
  const route = useRoute()
  if (route.meta.publicView) return false
  return roleValue.value >= roleRequiredForConfirmation.value
})

const userCreatedBooking = computed(() => {
  if (!props.event?.booking_id) return false
  return userHasCreatedBooking(props.event.booking_id)
})

const canDelete = computed(() => {
  return userCreatedBooking.value || roleValue.value >= 3
})

const isConfirmed = ref(false)

const confirmEvent = async () => {
  await approveRequest({ id: props?.event?.booking_id, ...props.event } as Booking).then(() => {
    isConfirmed.value = true
    emit('confirmed', props?.event?.booking_id)
  })
}

const deleteEvent = async () => {


const dialogStore = useDialogStore()

  // Example usage:
  dialogStore.show({
    title: t('bookingComponents.editEvent.confirmDelete'),
    message: t('bookingComponents.editEvent.confirmDeleteMessage'),
    type: 'warning',
    confirmText: t('bookingComponents.editEvent.deleteButton'),
    cancelText: t('bookingComponents.editEvent.cancelButton'),
    onConfirm: async () => {
      // Handle confirmation
      if (userCreatedBooking.value) {
        const uniqueId = selectedBookableObject.value?.uniqueId
        const secretEditKey = props.event?.secret_edit_key
        if (uniqueId && secretEditKey) {
          await deleteBookingBySecretKey(uniqueId, secretEditKey)
          open.value = false
          emit('delete', props?.event?.booking_id)
        }
      } else {
        await rejectRequest({ id: props?.event?.booking_id, ...props.event } as Booking, true)
        open.value = false
        emit('delete', props?.event?.booking_id)
      }
    }
  })
}

// watcher on event -> open dialog if event is set close if null
watch(
  () => props.event,
  (event) => {
    open.value = !!event
    if (event) {
      isConfirmed.value = event.confirmed
    }
  },
  { immediate: true } // Make sure it runs immediately on mount
)

watch(
  () => open.value,
  (isOpen) => {
    if (!isOpen) emit('close')
  }
)
</script>

<template>
  <UseTemplate>
    <div class="px-4 flex gap-2 flex-col" v-if="event">
      <div>
        <div class="flex gap-3 mb-2">
          <h3 class="text-md font-semibold">{{ t('bookingComponents.editEvent.status') }}:</h3>
          <div class="flex gap-1">
            <p :class="{ 'text-green-600': isConfirmed, 'text-red-600': !isConfirmed }">
              {{ isConfirmed ? t('bookingComponents.editEvent.confirmed') : t('bookingComponents.editEvent.notConfirmed') }}
            </p>
            <template v-if="isConfirmed">
              <span class="text-muted-foreground"> {{ t('bookingComponents.editEvent.by') }} </span>
              <span class="text-md font-semibold">{{ event.confirmed_by_name || event.confirmed_by?.display_name || t('bookingComponents.editEvent.default') }}</span>
            </template>
          </div>
        </div>
        <div v-if="requestLoading" class="text-muted-foreground flex">
          <LoaderIcon class="w-4 h-4 me-2 text-muted-foreground animate-spin" />
          {{ t('bookingComponents.editEvent.loading') }}
        </div>
        <div v-else class="flex gap-2 mt-2">
          <Button v-if="canConfirm && !isConfirmed" variant="outline" @click="confirmEvent">
            <CheckIcon class="w-4 h-4 me-2 text-green-500" />
            {{ t('bookingComponents.editEvent.confirmButton') }}
          </Button>
          <Button v-if="canDelete" variant="outline" @click="deleteEvent">
            <TrashIcon class="w-4 h-4 me-2 text-red-500" />
            {{ isConfirmed || userCreatedBooking ? t('bookingComponents.editEvent.deleteButton') : t('bookingComponents.editEvent.rejectButton') }}
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <template v-if="event.mail || event.phone || event.display_name || event.booking_display_name">
          <h3 class="text-md font-semibold">
            {{ t('bookingComponents.editEvent.contactInformation') }}
          </h3>
          <div class="ps-3 flex flex-col gap-2 border-l-2 -mt-2.5 pt-2.5">
            <div
              class="grid w-full max-w-sm items-center gap-1.5"
              v-if="event.display_name || event.booking_display_name"
            >
              <Label class="text-muted-foreground">{{ t('bookingComponents.editEvent.title') }}:</Label>
              <Input :model-value="event.display_name" v-if="event.display_name" readonly />
              <Input :model-value="event.booking_display_name" v-else readonly />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.mail">
              <Label class="text-muted-foreground">{{ t('bookingComponents.editEvent.email') }}:</Label>
              <Input :model-value="event.mail" readonly type="email" />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.phone">
              <Label class="text-muted-foreground">{{ t('bookingComponents.editEvent.phone') }}:</Label>
              <Input :model-value="event.phone" readonly type="tel" />
            </div>
          </div>
        </template>

        <div class="grid w-full max-w-sm items-center gap-1.5" v-if="event.description">
          <Label class="text-md font-semibold">{{ t('bookingComponents.editEvent.description') }}</Label>
          <Textarea :model-value="event.description" readonly />
        </div>
      </div>
    </div>
  </UseTemplate>

  <Dialog v-if="isDesktop" v-model:open="open">
    <DialogContent class="sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>
          {{ t('bookingComponents.editEvent.eventOn') }} {{ formattedDate }}
          <span v-if="!event?.is_full_day"> {{ t('bookingComponents.editEvent.from') }} {{ formattedTime }}</span>
          <b v-else>{{ t('bookingComponents.editEvent.allDay') }}</b>
        </DialogTitle>
      </DialogHeader>
      <GridForm />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerContent class="max-h-screen">
      <DrawerHeader class="text-left">
        <DrawerTitle>
          {{ t('bookingComponents.editEvent.eventOn') }} {{ formattedDate }}
          <span v-if="!event?.is_full_day"> {{ t('bookingComponents.editEvent.from') }} {{ formattedTime }}</span>
          <b v-else>{{ t('bookingComponents.editEvent.allDay') }}</b>
        </DrawerTitle>
      </DrawerHeader>
      <div class="max-h-[80%] overflow-y-auto">
        <GridForm />
      </div>
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline"> {{ t('bookingComponents.editEvent.cancelButton') }} </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
