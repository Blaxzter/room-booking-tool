import type { Booking } from '@/types'

export const getAllBookings = ({
  bookable_object_id,
  isUniqueId = false
}: {
  bookable_object_id: string
  isUniqueId?: boolean
}): string => {
  return `
query Booking {
    Booking(filter: { bookable_object_id: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: ${bookable_object_id} } } }) {
        id
        status
        date_created
        date_updated
        start_date
        end_date
        is_full_day
        mail
        phone
        description
        confirmed
    }
}`
}

export type BookingRequest = {
  booking: Booking[]
}

export type CreateBookingRequest = {
  bookable_object_id: string
  start_date: string
  end_date: string
  is_full_day: boolean
  mail: string
  phone: string
  description: string
  confirmed: boolean
  status: string
}
