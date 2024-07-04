export type MySchema = {
  bookable_object: BookableObject[]
  booking: Booking[]
  group: Group[]
  users: User[]
  notification_setting: NotificationSetting[]
}

export type Booking = {
  id: string
  bookable_object_id: BookableObject | string
  created_user_id: string
  start_date: string
  end_date: string
  is_full_day: boolean
  display_name?: string
  mail: string
  phone: string
  description: string
  confirmed: boolean
  confirmed_by?: string
  secret_edit_key?: string
}

export type BookableObject = {
  id: string
  status?: string
  owner?: { id: string }
  date_created?: string
  date_updated?: string
  name: string
  location?: {
    type: string
    coordinates: number[]
  }
  description?: string
  tags?: string[] | null
  image?: { id: string } | null
  is_internal?: boolean
  uniqueId?: string
  group?: { group_id: Group }[] | number[]
  type?: string
  confirm_booking_required?: boolean
  information_shared?: boolean
}

export type CreateBookableObjectRequest = {
  status: string
  owner: { id: string }
  name: string
  location?: {
    type: string
    coordinates: number[]
  }
  description?: string
  tags?: string[] | null
  image?: { id: string } | null
  is_internal: boolean
  group?: { group_id: Group }[]
  type?: string
  confirm_booking_required?: boolean
  information_shared?: boolean
}

export type Group = {
  id: string
  name: string
  description?: string
  owner?: string
  avatar?: {
    id: string
  }
  emoji?: string
  users?: GroupDirectusUser[]
}

export type CreateGroupRequest = {
  name: string
  description?: string
  owner?: string
  emoji?: string
  avatar?: {
    id: string
  }
  users?: GroupDirectusUser[]
}

export type GroupUser = {
  id?: string
  first_name: string
  last_name: string
  email: string
}

export type GroupDirectusUser = {
  id?: string
  directus_users_id: string | User
  group_id?: string
  role: string
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
  avatar: string | undefined
  language: string
  appearance: string
  tfa_secret: string | null
  status: 'active' | 'inactive'
  role: string
  token: string | null
  last_access: string
  last_page: string
  display_name: string
}

export type NotificationSetting = {
  id: string | undefined
  // references
  user_id?: User | string | null
  bookable_object_id?: BookableObject | string | null
  group_id?: Group | string | null
  // settings
  email_notification: boolean
  telegram: boolean
}

export type UpdateUserRequest = {
  first_name: string
  last_name: string
  email: string
  avatar: string | null
  display_name: string
}

export type CreateUserRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type LocalUserData = {
  selected_group?: string
  created_bookings?: { [id: string]: { [id: string]: string } }
}

interface Invite {
  email: string
  role: 'member' | 'admin' | 'viewer'
}

export type InviteRequest = {
  invites: Invite[]
}
