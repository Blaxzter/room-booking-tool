export type MySchema = {
  bookable_object: BookableObject[]
  booking: Booking[]
  group: Group[]
  users: User[]
  notification_setting: NotificationSetting[]
  group_directus_users: GroupDirectusUser[]
  group_invites: GroupInvite[]
  static_page: StaticPage[]
  settings: GlobalSettings
}

export type GlobalSettings = {
  display_legal: boolean
  show_buy_me_a_coffee: boolean
}

export type StaticPage = {
  slug: string
  content: string
  language: string
}

export type Booking = {
  id: string
  bookable_object_id: BookableObject | string
  created_user_id?: string
  start_date: string
  end_date: string
  is_full_day: boolean
  display_name?: string
  booking_display_name?: string
  confirmed_by_name?: string
  mail: string
  phone: string
  description: string
  confirmed: boolean
  confirmed_by?: string | User
  secret_edit_key?: string
}

export type GroupBookableObjectReference = {
  id?: string
  bookable_object_id: BookableObject
  group_id?: Group | string
}

export type BookableObject = {
  id: string
  status?: string
  owner?: { id: string } | string
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
  group?: { group_id: Group }[] | string[]
  type?: string
  confirm_booking_required?: boolean
  confirm_role?: string
  information_shared?: boolean
  language?: string
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
  language?: string
}

export type Group = {
  id: string
  name: string
  description?: string
  owner?: { id: string } | string
  avatar?: {
    id: string
  }
  emoji?: string
  users?: GroupDirectusUser[]
  bookable_objects?: GroupBookableObjectReference[]
  invites?: GroupInvite[]
}

export type GroupInvite = {
  id: string
  group_id: string | Group
  user_id?: string | User
  email: string
  role: string
}

export type CreateGroupRequest = {
  name: string
  description?: string
  owner?: string | { id: string }
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
  avatar: string | undefined | { id: string }
  language: string
  appearance: string
  tfa_secret: string | null
  status: 'active' | 'inactive'
  role: string
  token: string | null
  last_access: string
  last_page: string
  display_name: string

  telegram_user_id: string | null
  telegram_user_name: string | null

  Groups?: GroupDirectusUser[]
  Invites?: GroupInvite[]
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
  telegram_user_id: string | null
  telegram_user_name: string | null
}

export type CreateUserRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type CreatedBookingInfo = {
  secret_edit_key: string
  event_date: string // ISO string
  public_booking_id?: string
}

export type LocalUserData = {
  selected_group?: string
  created_bookings?: { [userId: string]: { [bookingId: string]: CreatedBookingInfo } }
}

export interface InviteCreateRequest {
  email: string
  role: 'member' | 'admin' | 'viewer'
}
