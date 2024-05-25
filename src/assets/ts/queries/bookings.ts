import type { Booking } from '@/types'

export const getBookingQObject = ({
  bookable_object_id,
  isUniqueId = false
}: {
  bookable_object_id: string
  isUniqueId?: boolean
}): string => {
  return `
  booking(filter: { bookable_object_id: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: ${bookable_object_id} } } }) {
        id
        status
        date_created
        date_updated
        start_date
        end_date
        is_full_day
        display_name
        mail
        phone
        description
        confirmed
        confirmed_by {
          display_name
        }
    }`
}

export const getAllBookings = ({
  bookable_object_id,
  isUniqueId = false
}: {
  bookable_object_id: string
  isUniqueId?: boolean
}): string => {
  return `
query Booking {
    ${getBookingQObject({ bookable_object_id, isUniqueId })}
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
