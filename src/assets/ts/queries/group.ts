export const groupFields = `
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
`

export const getGroupsWithUserQuery = ({
  as_query,
  with_bookable_objects = false,
  group_id = undefined
}: {
  as_query: boolean
  with_bookable_objects?: boolean
  group_id?: string
}): string => {
  const groups_query = `
    group${group_id ? `(filter: { id: { _eq: "${group_id}" } })` : ''} {
        date_created
        date_updated
        description
        emoji
        id
        name
        sort
        status
        owner {
            id
        }
        users {
            id
            role
            directus_users_id {
                id
                first_name
                last_name
                email
                avatar {
                    id
                }
            }
        }
        avatar {
            id
        }
    }
    ${
      with_bookable_objects
        ? `
        bookable_object {
        name
        group {
            group_id {
                id
            }
        }
    }`
        : ''
    }
    `

  if (as_query) {
    return `
      query Groups
      {
          ${groups_query}
      }
    `
  }
  return `
    ${groups_query}
  `
}

export const getGroupQuery = ({ as_query }: { as_query: boolean }): string => {
  const group_query = `group {
      ${groupFields}
    }`

  if (as_query) {
    return `
      query Group
      {
          ${group_query}
      }
    `
  }
  return `
    ${group_query}
  `
}
