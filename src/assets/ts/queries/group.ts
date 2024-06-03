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
