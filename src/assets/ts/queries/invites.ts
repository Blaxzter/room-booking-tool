export const inviteFields = `
    id
    group_id
    user_id
    email
    role
`

export const getInviteQuery = ({ as_query, user_id }: { as_query: boolean; user_id: string }): string => {
  let invite_query = `invite`
  if (user_id) {
    invite_query = `invite(filter: {user_id: {eq: "${user_id}"}}) {
      ${inviteFields}
    }`
  } else {
    invite_query = `invite {
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
