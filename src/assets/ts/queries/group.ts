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

export const getGroupsWithUserQuery = ({ as_query }: { as_query: boolean }): string => {
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
    }`

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
