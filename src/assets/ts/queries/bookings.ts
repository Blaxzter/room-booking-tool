import type { Booking } from '@/types'
import { getBookableObjectFields } from '@/assets/ts/queries/bookable_objects'

function bookingVariables({ include_bookable_object = false }: { include_bookable_object?: boolean }): string {
  const booking_rows = `
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
  `
  if (include_bookable_object) {
    return `
    bookable_object_id {
      ${getBookableObjectFields()}
    }
    ${booking_rows}
    `
  }
  return booking_rows
}

export const getBookingQObject = ({
  bookable_object_id,
  isUniqueId = false
}: {
  bookable_object_id: string
  isUniqueId?: boolean
}): string => {
  return `
  booking(filter: { bookable_object_id: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: ${bookable_object_id} } } }) {
      ${bookingVariables({})}
    }`
}

export const getBookingByManagement = ({
  user_id,
  as_query,
  include_bookable_object,
  page,
  limit
}: {
  user_id: string
  as_query: boolean
  include_bookable_object: boolean
  page: number
  limit: number
}): string => {
  const booking_query = `
      booking(
        filter: {
            _or: [
                {
                    bookable_object_id: {
                        group: {
                            group_id: {
                                users: {
                                    directus_users_id: {
                                        id: { _eq: "${user_id}" }
                                    }
                                }
                            }
                        }
                    }
                }
                {
                    bookable_object_id: {
                        owner: { id: { _eq: "${user_id}" } }
                    }
                }
            ]
            confirmed: { _eq: false }
        }
        page: ${page}
        limit: ${limit}
    ) {
      ${bookingVariables({ include_bookable_object })}
    }`

  if (as_query) {
    return `
      query Booking
      {
          ${booking_query}
      }
    `
  }
  return booking_query
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
  secret_edit_key?: string
}
