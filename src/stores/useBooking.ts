import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Booking } from '@/types'
import { useAuth } from '@/stores/auth'
import { type BookingRequest, type CreateBookingRequest, getAllBookings } from '@/assets/ts/queries/bookings'
import { useToast } from '@/components/ui/toast'
import { useBookableObjects } from '@/stores/bookableObjects'
import { createItem } from '@directus/sdk'

export const useBooking = defineStore('bookings', () => {
  const { toast } = useToast()
  const { client } = useAuth()

  const loading = ref(false)
  const bookingsPerBookableObjectId = ref<{ [key: string]: Booking[] }>({})

  const { selectedBookableObject } = storeToRefs(useBookableObjects())

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
          bookingsPerBookableObjectId.value[bookable_object_id] = res.booking
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

  const createBookings = async (booking: CreateBookingRequest) => {
    booking.status = 'published'
    if (!selectedBookableObject.value) {
      throw new Error('No bookable object selected')
    }
    booking.bookable_object_id = `${selectedBookableObject.value.id}`
    const result = await client.request(createItem('booking', booking))
    console.log(result)
    // cast result to BookableObject
    currentBookings.value.push(result)
    return result
  }

  const currentBookings = computed(() => {
    const id = selectedBookableObject?.value?.id
    if (!id) {
      return []
    }
    const valueElement = bookingsPerBookableObjectId.value[id]
    if (!valueElement) {
      bookingsPerBookableObjectId.value[id] = []
    }
    return bookingsPerBookableObjectId.value[id]
  })

  return {
    bookingsPerBookableObjectId,
    currentBookings,
    fetchBookableObjectsByGroupId,
    createBookings
  }
})
