import type { BookableObject, Group } from '@/types'

export const getGroupQuery = (id: number) => `
query Initial_Data {
    group(filter: { id: { _eq: "${id}" } }) {
        id
        status
        sort
        date_created
        date_updated
        name
        description
    }
    bookable_object_group(filter: { group_id: { id: { _eq: "${id}" } } }) {
        id
        bookable_object_id {
            id
            status
            date_created
            date_updated
            location
            name
            description
            tags
            is_internal
        }
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
