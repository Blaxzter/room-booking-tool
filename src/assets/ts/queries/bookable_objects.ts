import type { BookableObject } from '@/types'

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

interface GetBookableObjectParams {
  id: string
  isUniqueId?: boolean
}

export const qGetBookableObjectById = ({ id, isUniqueId = false }: GetBookableObjectParams): string => `
query Bookable_object {
    bookable_object(filter: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: "${id}" } }) {
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

export type BookableObjectRequest = {
  bookable_object: BookableObject[]
}
