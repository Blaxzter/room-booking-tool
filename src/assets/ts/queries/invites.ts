export const inviteFields = `
        id
        group_id {
            name
        }
        email
        role                                                  
`

export const getInviteQuery = ({ as_query, user_id }: { as_query: boolean; user_id: string }): string => {
  let invite_query = `invite`
  if (user_id) {
    invite_query = `group_invites(filter: {user_id: { id: { _eq: "${user_id}" } } }) {
      ${inviteFields}
    }`
  } else {
    invite_query = `group_invites {
      ${inviteFields}
    }`
  }

  if (as_query) {
    return `
      query Invite
      {
          ${invite_query}
      }
    `
  }
  return `
    ${invite_query}
  `
}

