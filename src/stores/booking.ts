import { computed, ref } from 'vue'
import { createItem } from '@directus/sdk'
import { v4 as uuidv4 } from 'uuid'
import { defineStore, storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useToast } from '@/components/ui/toast'
import { useUser } from '@/stores/user'
import { useBookableObjects } from '@/stores/bookableObjects'

import { type BookingRequest, type CreateBookingRequest, getAllBookings } from '@/assets/ts/queries/bookings'
import type { Booking } from '@/types'
import { useLocalUser } from '@/stores/localUser'
import axios, { type AxiosResponse } from 'axios'

export const useBookings = defineStore('bookings', () => {
  const { toast } = useToast()
  const { t } = useI18n()
  const { client } = useUser()

  const publicBookableObjectId = ref<string | undefined>(undefined)
  const loading = ref(false)
  const bookingsPerBookableObjectId = ref<{ [key: string]: Booking[] }>({})

  const { selectedBookableObject } = storeToRefs(useBookableObjects())

  const reset = () => {
    bookingsPerBookableObjectId.value = {}
    loading.value = false
  }

  const setBookings = (bookable_object_id: string, data: Booking[]) => {
    bookingsPerBookableObjectId.value[bookable_object_id] = data
  }

  const fetchBookableObjectsByGroupId = async ({
    bookable_object_id,
    isUniqueId = false
  }: {
    bookable_object_id: string
    isUniqueId?: boolean
  }) => {
    // Fetch bookable objects from the server
    if (bookingsPerBookableObjectId.value[bookable_object_id]) {
      return
    } else {
      loading.value = true
      await client
        .query<BookingRequest>(getAllBookings({ bookable_object_id, isUniqueId }))
        .then((res) => {
          setBookings(bookable_object_id, res.booking)
          loading.value = false
          return res
        })
        .catch((error) => {
          loading.value = false
          toast({
            title: 'Error',
            description: error.message
          })
        })
    }

    return
  }

  const createBooking = async (booking: CreateBookingRequest) => {
    booking.status = 'published'
    if (!selectedBookableObject.value) {
      throw new Error('No bookable object selected')
    }

    if (!selectedBookableObject.value.confirm_booking_required) {
      booking.confirmed = true
    }

    booking.bookable_object_id = `${selectedBookableObject.value.id}`
    booking.secret_edit_key = uuidv4()

    try {
      let result
      if (publicBookableObjectId.value) {
        const backendUrl = import.meta.env.DEV
        ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055'
        : `${window.location.origin}/api`
  
      result = await axios
        .post(`${backendUrl}/public/${publicBookableObjectId.value}/booking`, booking)
        .then((res: AxiosResponse<Booking>) => {
          return { ...booking, ...res.data }
        })
      } else {
        result = await client.request(createItem('booking', booking))
      }

      // Add the secret edit key to the local user store to allow editing of unlogged in users
      if (result.secret_edit_key) {
        const { addCreatedBooking } = useLocalUser()
        addCreatedBooking(result.id, result.secret_edit_key, result.start_date, publicBookableObjectId.value || '')
      }
      // cast result to BookableObject
      currentBookings.value.push(result as Booking)
      return result
    } catch (error: any) {
      let errorMessage = error?.errors?.[0]?.message
      // Check for specific error codes
      if (error?.errors?.[0]?.message === 'NO_ELEMENTS_DEMO_MODE') {
        errorMessage = t('demoMode.limits.limitReached')
      }

      toast({
        title: t('booking.create.error.title', 'Error creating booking'),
        description: errorMessage,
        variant: 'destructive'
      })
      throw error
    }


  }

  const currentBookings = computed(() => {
    const id = selectedBookableObject?.value?.id || selectedBookableObject?.value?.uniqueId
    if (!id) {
      return []
    }
    const valueElement = bookingsPerBookableObjectId.value[id]
    if (!valueElement) {
      bookingsPerBookableObjectId.value[id] = []
    }
    return bookingsPerBookableObjectId.value[id]
  })

  const removeBookingById = (booking_id: string) => {
    if (!booking_id) {
      return
    }
    const id = selectedBookableObject?.value?.id || selectedBookableObject?.value?.uniqueId
    if (!id) {
      return
    }
    bookingsPerBookableObjectId.value[id] = bookingsPerBookableObjectId.value[id].filter(
      (booking) => booking.id !== booking_id
    )
  }

  /**
   * Delete a booking using the public endpoint and secret_edit_key
   * @param bookableObjectUniqueId - uniqueId of the bookable object
   * @param secretEditKey - secret_edit_key of the booking
   */
  const deleteBookingBySecretKey = async (bookableObjectUniqueId: string, secretEditKey: string) => {
    try {
      const backendUrl = import.meta.env.DEV
        ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055'
        : `${window.location.origin}/api`
      await axios.delete(`${backendUrl}/public/${bookableObjectUniqueId}/booking`, {
        data: { secret_edit_key: secretEditKey }
      })
      // Optionally remove from local state if needed
      toast({
        title: t('booking.delete.success.title', 'Booking deleted'),
        description: t('booking.delete.success.description', 'The booking was deleted successfully.'),
        variant: 'success'
      })
    } catch (error: any) {
      toast({
        title: t('booking.delete.error.title', 'Error deleting booking'),
        description: error?.response?.data?.error || error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  return {
    publicBookableObjectId,
    bookingsPerBookableObjectId,
    currentBookings,
    fetchBookableObjectsByGroupId,
    createBooking,
    setBookings,
    reset,
    removeBookingById,
    deleteBookingBySecretKey
  }
})
