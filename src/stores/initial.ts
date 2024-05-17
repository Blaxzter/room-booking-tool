import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth'

import {
  getGroupQuery,
  type GetGroupQueryResponse,
  getInitialDataQuery,
  type GetInitialDataQueryResponse
} from '@/assets/ts/queries/initial_data'
import { useGroups } from '@/stores/groups'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import _ from 'lodash'

export const useInitialDataStore = defineStore('initial', () => {
  const { client, user } = useAuth()

  const { setGroups } = useGroups()
  const { setBookableObjects } = useBookableObjects()
  const { getSelectedGroup } = useUser()

  const fetchInitialData = async () => {
    try {
      const selectedGroup = getSelectedGroup()
      let received_data = null
      if (!_.isNil(selectedGroup) && selectedGroup !== '-1') {
        const groupQuery = getGroupQuery(selectedGroup)
        received_data = await client.query<GetGroupQueryResponse>(groupQuery)

        setBookableObjects({ data: received_data.bookable_object, groupId: selectedGroup })
      } else {
        const initialDataQuery = getInitialDataQuery(user.id)
        received_data = await client.query<GetInitialDataQueryResponse>(initialDataQuery)
        setBookableObjects({ data: received_data.bookable_object })
      }

      await setGroups(received_data.group)
    } catch (error) {
      console.error(error)
    }
  }

  return { fetchInitialData }
})
