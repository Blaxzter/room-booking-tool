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
  with_bookable_objects = false
}: {
  as_query: boolean
  with_bookable_objects?: boolean
}): string => {
  const groups_query = `
    group {
        date_created
        date_updated
        description
        emoji
        id
        name
        sort
        status
        users {
            id
            role
            directus_users_id {
                id
                first_name
                last_name
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
