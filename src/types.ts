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

export type InitialData = {
  bookable_objects: BookableObject[]
  groups: Group[]
}

export type User = {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  location: string
  title: string
  description: string | null
  tags: string[] | null
  avatar: string | null
  language: string
  appearance: string
  tfa_secret: string | null
  status: 'active' | 'inactive'
  role: string
  token: string | null
  last_access: string
  last_page: string
}
