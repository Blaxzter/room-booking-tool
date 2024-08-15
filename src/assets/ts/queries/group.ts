export const groupFields = ({ user_id = undefined }: { user_id?: string }) => {
  console.log(user_id)
  return `
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
        invites {
            id
            user_id {
                id
            }
            email
            role
        }
        bookable_objects {
            bookable_object_id {
                id
            }
        }
        ${user_id != undefined ? `users(filter: { directus_users_id: { id: { _eq: "${user_id}" } } }) { role }` : ''}
  `
}

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
        invites {
            id
            user_id {
                id
            }
            email
            role
        }
        ${with_bookable_objects ? `bookable_objects { bookable_object_id { name } }` : ''}
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

export const getGroupQuery = ({ as_query, user_id }: { as_query: boolean; user_id?: string }): string => {
  const group_query = `group {
      ${groupFields({ user_id })}
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
