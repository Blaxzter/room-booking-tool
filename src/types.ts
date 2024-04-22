export type MySchema = {
  bookable_object: BookableObject[]
}

export type Booking = {
  id: number
  bookable_object_id: number
  user_id: number
  start_date: string
  end_date: string
  room: string
  mail: string
  phone: string
  description: string
  confirmBooking: boolean
}

export const BookingImpl: Booking = {
  id: 0,
  bookable_object_id: 0,
  user_id: 0,
  start_date: '',
  end_date: '',
  room: '',
  mail: '',
  phone: '',
  description: '',
  confirmBooking: false
}

export type BookableObject = {
  id: number
  name: string
  description: string
  image: string
  location: string
  tags: string[]
}

export type Group = {
  id: number
  name: string
  description: string
  avatar?: string
}
