import type { BookableObject, Booking, Group, GroupInvite, NotificationSetting } from '@/types'
import {
  bookableObjectByGroup,
  bookableObjectById,
  getAllBookableObjects,
  qGetBookableObjectByOwner
} from '@/assets/ts/queries/bookable_objects'
import { getBookingByManagement, getBookingQObject } from '@/assets/ts/queries/bookings'
import { getGroupQuery } from '@/assets/ts/queries/group'
import { getNotificationSettings } from '@/assets/ts/queries/notificationSettings'

export const getDashboardByGroup = (group_id: string) => `
query Initial_Data {
    group {
        id
        status
        sort
        date_created
        date_updated
        name
        description
        emoji
        avatar {
            id
        }
    }
    ${bookableObjectByGroup(group_id)}
}
`

export const getInitialDataQuery = (user_id: string) => `
query Bookable_object {
    group {
        id
        status
        sort
        date_created
        date_updated
        name
        description
        emoji
        avatar {
            id
        }
    }
    ${qGetBookableObjectByOwner(user_id)}
}
`

export const objectView = ({
  bookable_object_id,
  isUniqueId = false,
  publicView = false
}: {
  bookable_object_id: string
  isUniqueId?: boolean
  publicView?: boolean
}): string => {
  return `
    query Object_view {
        ${publicView ? '' : getGroupQuery({ as_query: false })}
        ${getBookingQObject({ bookable_object_id, isUniqueId })}   
        ${bookableObjectById({ id: bookable_object_id, isUniqueId })}
    }
  `
}

export const requestViewQuery = ({
  user_id,
  pagination = false
}: {
  user_id: string
  pagination?: boolean
}): string => {
  const query_params = { user_id, as_query: false, include_bookable_object: true, page: 1, limit: 1000 }
  if (pagination) {
    query_params.page = 1
    query_params.limit = 10
  }
  return `
    query Request_view {
        ${getGroupQuery({ as_query: false })}
        ${getBookingByManagement(query_params)}   
    }
  `
}

export const settingsViewQuery = (): string => {
  return `
    query Request_view {
        ${getGroupQuery({ as_query: false })}
        ${getAllBookableObjects({ minimal: true })}
        ${getNotificationSettings()}
    }
  `
}

export interface ObjectViewResponse {
  group?: Group[]
  booking: Booking[]
  bookable_object: BookableObject[]
}

export interface GetGroupsQueryResponse {
  group: Group[]
  bookable_object?: BookableObject[]
}

export interface GetInviteQueryResponse {
  group_invites: GroupInvite[]
}

export interface GetGroupQueryResponse {
  group: Group
  bookable_object?: BookableObject[]
}

export interface GetInitialDataQueryResponse {
  group: Group[]
  bookable_object: BookableObject[]
}

export interface BookableObjectsRequest {
  bookable_object: BookableObject[]
}

export interface RequestViewResponse {
  group: Group[]
  booking: Booking[]
}

export interface SettingsViewResponse {
  group: Group[]
  bookable_object: BookableObject[]
  notification_setting: NotificationSetting[]
}
