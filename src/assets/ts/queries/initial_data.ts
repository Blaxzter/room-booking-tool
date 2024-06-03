import type { BookableObject, Booking, Group } from '@/types'
import {
  bookableObjectByGroup,
  bookableObjectById,
  qGetBookableObjectByOwner
} from '@/assets/ts/queries/bookable_objects'
import { getBookingByManagement, getBookingQObject } from '@/assets/ts/queries/bookings'
import { getGroupQuery } from '@/assets/ts/queries/group'

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

export const requestViewQuery = ({ user_id }: { user_id: string }): string => {
  return `
    query Request_view {
        ${getGroupQuery({ as_query: false })}
        ${getBookingByManagement({ user_id, as_query: false, page: 1, limit: 10 })}   
    }
  `
}

export interface ObjectViewResponse {
  group?: Group[]
  booking: Booking[]
  bookable_object: BookableObject[]
}

export interface GetGroupQueryResponse {
  group: Group[]
  bookable_object: BookableObject[]
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
