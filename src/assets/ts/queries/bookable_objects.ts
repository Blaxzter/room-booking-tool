import type { BookableObject } from '@/types'

interface GetBookableObjectParams {
  id: string
  isUniqueId?: boolean
}

export function getBookableObjectFields({ minimal }: { minimal: boolean } = { minimal: false }): string {
  const retFields = `
    id
    name
  `
  if (!minimal) {
    return `
    ${retFields}
    status
    date_created
    date_updated
    location
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
    `
  }
  return retFields
}

export const bookableObjectByGroup = (group_id: string) => `
  bookable_object(filter: { group: { group_id: { id: { _eq: "${group_id}" } } } }) {
    ${getBookableObjectFields()}
  }
`

export const getBookableObjectByGroup = (group_id: string) => `
  query Bookable_object {
      ${bookableObjectByGroup(group_id)}
  }
`

export const bookableObjectById = ({ id, isUniqueId = false }: GetBookableObjectParams): string => `
  bookable_object(filter: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: "${id}" } }) {
      ${getBookableObjectFields()}
  }
`

export const qGetBookableObjectById = ({ id, isUniqueId = false }: GetBookableObjectParams): string => `
query Bookable_object {
    bookable_object(filter: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: "${id}" } }) {
        ${getBookableObjectFields()}
    }
}`

export const qGetBookableObjectByOwner = (owner_id: string) => `
bookable_object(
    filter: { owner: { id: { _eq: "${owner_id}" } } }
) {
    ${getBookableObjectFields()}
}`

export const getAllBookableObjects = ({ minimal }: { minimal: boolean }) => `
bookable_object{
  ${getBookableObjectFields({ minimal })}
}
`

export const qGetAllBookableObjects = ({ minimal }: { minimal: boolean }) => `
query Bookable_object {
  ${getAllBookableObjects({ minimal })}
}
`

export type BookableObjectRequest = {
  bookable_object: BookableObject[]
}
export const userBookableObject = (user_id: string) => `
query Bookable_object {
    ${qGetBookableObjectByOwner(user_id)}
}
`
