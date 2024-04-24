import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth'
import type { InitialData } from '@/types'
import { getInitialDataQuery, getGroupQuery } from '@/assets/ts/gql_queries'
import { useGroups } from '@/stores/groups'

type LocalUserData = {
  selected_group?: number
}

export const useInitialDataStore = defineStore('initial', () => {
  const { client, getAuthenticatedUser } = useAuth()

  const { setGroups } = useGroups()

  const get_local_user_data = () => {
    const user_data = localStorage.getItem('user_data')
    if (user_data) {
      return JSON.parse(user_data) as LocalUserData
    }
    return {}
  }

  const fetchInitialData = async () => {
    try {
      const user_data = get_local_user_data()
      let received_data = null
      if (user_data && user_data.selected_group) {
        received_data = await client.query<InitialData>(
          getGroupQuery(user_data.selected_group)
        )
      } else {
        received_data = await client.query<InitialData>(
          getInitialDataQuery(getAuthenticatedUser().id)
        )
      }
      console.log('received_data', received_data)
    } catch (error) {
      console.error(error)
    }
  }

  return { fetchInitialData }
})
