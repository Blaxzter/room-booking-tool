import { computed, ref } from 'vue'
import { createItem } from '@directus/sdk'
import { v4 as uuidv4 } from 'uuid'
import { defineStore, storeToRefs } from 'pinia'

import { useToast } from '@/components/ui/toast'
import { useUser } from '@/stores/user'
import { useBookableObjects } from '@/stores/bookableObjects'

import { type BookingRequest, type CreateBookingRequest, getAllBookings } from '@/assets/ts/queries/bookings'
import type { Booking } from '@/types'
import { useLocalUser } from '@/stores/localUser'
import axios, { type AxiosResponse } from 'axios'

export const useBookings = defineStore('bookings', () => {
  const { toast } = useToast()
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
          return res.data
        })
      } else {
        result = await client.request(createItem('booking', booking))
      }

      // Add the secret edit key to the local user store to allow editing of unlogged in users
      if (result.secret_edit_key) {
        const { addCreatedBooking } = useLocalUser()
        addCreatedBooking(result.id, result.secret_edit_key)
      }
      // cast result to BookableObject
      currentBookings.value.push(result as Booking)
      return result
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error creating bookable object',
        description: error?.errors?.[0]?.message,
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


  return {
    publicBookableObjectId,
    bookingsPerBookableObjectId,
    currentBookings,
    fetchBookableObjectsByGroupId,
    createBooking,
    setBookings,
    reset,
    removeBookingById
  }
})
