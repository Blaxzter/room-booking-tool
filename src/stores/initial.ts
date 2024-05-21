import { defineStore } from 'pinia'
import { useAuth } from '@/stores/auth'

import {
  getGroupQuery,
  type GetGroupQueryResponse,
  getInitialDataQuery,
  type GetInitialDataQueryResponse,
  objectView,
  type ObjectViewResponse
} from '@/assets/ts/queries/initial_data'
import { useGroups } from '@/stores/groups'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useBooking } from '@/stores/useBooking'
import _ from 'lodash'

export const useInitialDataStore = defineStore('initial', () => {
  const { client, user } = useAuth()

  const { setGroups } = useGroups()
  const { setBookableObjects, selectBookableObject, addBookableObject } = useBookableObjects()
  const { getSelectedGroup } = useUser()
  const { setBookings } = useBooking()

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

  const fetchObjectViewData = async ({
    bookable_object_id,
    isUniqueId = false,
    publicView = false,
    select = false
  }: {
    bookable_object_id: string
    isUniqueId?: boolean
    publicView?: boolean
    select?: boolean
  }) => {
    try {
      const objectViewQuery = objectView({ bookable_object_id, isUniqueId, publicView })
      const res = await client.query<ObjectViewResponse>(objectViewQuery)
      if (select) {
        selectBookableObject(res.bookable_object[0])
      }
      addBookableObject(res.bookable_object[0])
      setBookings(bookable_object_id, res.booking)
      if (res.group) {
        await setGroups(res.group)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { fetchInitialData, fetchObjectViewData }
})
