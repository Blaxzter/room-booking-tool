export type MySchema = {
  bookable_object: BookableObject[]
}

export type Booking = {
  id: number
  bookable_object_id: number
  created_user_id: number
  start_date: string
  end_date: string
  is_full_day: boolean
  mail: string
  phone: string
  description: string
  confirmed: boolean
}

export const BookingImpl: Booking = {
  id: 0,
  bookable_object_id: 0,
  created_user_id: 0,
  start_date: '',
  end_date: '',
  is_full_day: false,
  mail: '',
  phone: '',
  description: '',
  confirmed: false
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
