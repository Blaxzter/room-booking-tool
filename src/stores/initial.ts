import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth'

import {
  getInitialDataQuery,
  getGroupQuery,
  type GetGroupQueryResponse,
  type GetInitialDataQueryResponse
} from '@/assets/ts/gql_queries'
import { useGroups } from '@/stores/groups'
import { useBookableObjects } from '@/stores/bookableObjects'

type LocalUserData = {
  selected_group?: number
}

export const useInitialDataStore = defineStore('initial', () => {
  const { client, user } = useAuth()

  const { setGroups } = useGroups()
  const { setBookableObjects } = useBookableObjects()

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
        const groupQuery = getGroupQuery(user_data.selected_group)
        received_data = await client.query<GetGroupQueryResponse>(groupQuery)
      } else {
        const initialDataQuery = getInitialDataQuery(user.id)
        received_data =
          await client.query<GetInitialDataQueryResponse>(initialDataQuery)
      }
      console.log(received_data)
      setGroups(received_data.group)
      setBookableObjects(received_data.bookable_object)
    } catch (error) {
      console.error(error)
    }
  }

  return { fetchInitialData }
})
