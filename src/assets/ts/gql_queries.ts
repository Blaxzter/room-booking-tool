import type { BookableObject, Group } from '@/types'

export const getGroupQuery = (group_id: string) => `
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
    bookable_object(filter: { group: { group_id: { id: { _eq: "${group_id}" } } } }) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image {
            id
        }
        is_internal
        group {
            id
        }
        uniqueId
        type
        confirm_booking_required
        information_shared
        confirm_role
    }
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
    bookable_object(
        filter: { owner: { id: { _eq: "${user_id}" } } }
    ) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image {
            id
        }
        is_internal
        group {
            id
        }
        uniqueId
        type
        confirm_booking_required
        information_shared
        confirm_role
    }
}
`

export interface GetGroupQueryResponse {
  group: Group[]
  bookable_object: BookableObject[]
}

export interface GetInitialDataQueryResponse {
  group: Group[]
  bookable_object: BookableObject[]
}

export const getBookableObjectByGroup = (group_id: string) => `
query Bookable_object {
    bookable_object(filter: { group: { group_id: { id: { _eq: "${group_id}" } } } }) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image {
            id
        }
        is_internal
        group {
            id
        }
        uniqueId
        type
        confirm_booking_required
        information_shared
        confirm_role
    }
}`

export const userBookableObject = (user_id: string) => `
query Bookable_object {
    bookable_object(
        filter: { owner: { id: { _eq: "${user_id}" } } }
    ) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image {
            id
        }
        is_internal
        group {
            id
        }
        uniqueId
        type
        confirm_booking_required
        information_shared
        confirm_role
    }
}
`

export interface BookableObjectRequest {
  bookable_object: BookableObject[]
}
