import type { BookableObject } from '@/types'

interface GetBookableObjectParams {
  id: string
  isUniqueId?: boolean
  isPublic?: boolean
}

export function getBookableObjectFields(
  { minimal, isPublic }: { minimal: boolean; isPublic: boolean } = { minimal: false, isPublic: false }
): string {
  const retFields = `
    id
    name
  `
  if (!minimal) {
    return `
    ${retFields}
    ${!isPublic ? 'status' : ''}
    ${!isPublic ? 'date_created' : ''}
    ${!isPublic ? 'date_updated' : ''}
    location
    description
    tags
    image {
        id
    }
    ${!isPublic ? 'is_internal' : ''}
    ${!isPublic ? 'group { group_id { id } }' : ''}
    uniqueId
    type
    confirm_booking_required
    information_shared
    ${!isPublic ? 'confirm_role' : ''}
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

export const bookableObjectById = ({ id, isUniqueId = false, isPublic = false }: GetBookableObjectParams): string => `
  bookable_object(filter: { ${isUniqueId ? 'uniqueId' : 'id'}: { _eq: "${id}" } }) {
      ${getBookableObjectFields({ minimal: false, isPublic: isPublic })}
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

export const getAllBookableObjects = ({ minimal, isPublic }: { minimal: boolean; isPublic: boolean }) => `
bookable_object{
  ${getBookableObjectFields({ minimal, isPublic })}
}
`

export const qGetAllBookableObjects = ({ minimal, isPublic }: { minimal: boolean; isPublic: boolean }) => `
query Bookable_object {
  ${getAllBookableObjects({ minimal, isPublic })}
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
