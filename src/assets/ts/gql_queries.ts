import type { BookableObject, Group } from '@/types'

export const getGroupQuery = (id: string) => `
query Initial_Data {
    group {
        id
        status
        sort
        date_created
        date_updated
        name
        description
    }
    bookable_object(filter: { group: { id: { _eq: ${id} } } }) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image
        is_internal
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
        image
        is_internal
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
    bookable_object(filter: { group: { id: { _eq: "${group_id}" } } }) {
        id
        status
        date_created
        date_updated
        location
        name
        description
        tags
        image
        is_internal
    }
}

`
