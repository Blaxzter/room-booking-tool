import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import {
  getDashboardByGroup,
  type GetGroupQueryResponse,
  getInitialDataQuery,
  type GetInitialDataQueryResponse,
  objectView,
  type ObjectViewResponse,
  type PublicObjectViewResponse,
  requestViewQuery,
  type RequestViewResponse,
  settingsViewQuery,
  type SettingsViewResponse
} from '@/assets/ts/queries/initial_data'
import { useGroups } from '@/stores/groups'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useRequests } from '@/stores/requests'
import { useLocalUser } from '@/stores/localUser'
import { useBookings } from '@/stores/booking'
import _ from 'lodash'
import { useToast } from '@/components/ui/toast/use-toast'
import { useNotificationSetting } from '@/stores/notificationSettings'
import type { Group } from '@/types'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

export const useInitialDataStore = defineStore('initial', () => {
  const { toast } = useToast()

  const { client } = useUser()
  const { user } = storeToRefs(useUser())

  const { setGroups } = useGroups()
  const { setBookableObjects, selectBookableObject, addBookableObject } = useBookableObjects()
  const { getSelectedGroup } = useLocalUser()
  const { setBookings } = useBookings()
  const { setRequests } = useRequests()
  const { setNotificationSettingsExtended } = useNotificationSetting()

  const init_loading = ref(true)

  const reset = () => {
    init_loading.value = false
  }

  const fetchDashboardViewData = async () => {
    init_loading.value = true
    try {
      const selectedGroup = getSelectedGroup()
      let received_data = null
      if (!_.isNil(selectedGroup) && selectedGroup !== '-1') {
        const { user } = storeToRefs(useUser())
        const groupQuery = getDashboardByGroup(user.value.id)
        received_data = await client.query<GetGroupQueryResponse>(groupQuery)
        for (const group of received_data.group) {
          if (group.bookable_objects && group.bookable_objects.length > 0) {
            setBookableObjects({
              data: _.map(group.bookable_objects, (ele) => ele.bookable_object_id),
              groupId: group.id
            })
          }
        }
      } else {
        const initialDataQuery = getInitialDataQuery(user.value.id)
        received_data = await client.query<GetInitialDataQueryResponse>(initialDataQuery)
        setBookableObjects({ data: received_data.bookable_object })
      }

      await setGroups(received_data.group as Group[])
    } catch (error) {
      console.error(error)
    }
    init_loading.value = false
  }

  const fetchPublicObjectViewData = async ({ bookable_object_id }: { bookable_object_id: string }) => {
    init_loading.value = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
      ? import.meta.env.VITE_BACKEND_URL
      : `https://api.${window.location.host}`

    await axios
      .get(`${backendUrl}/public/${bookable_object_id}`)
      .then(async (res: AxiosResponse<PublicObjectViewResponse>) => {
        selectBookableObject(res.data.bookableObject)
        addBookableObject(res.data.bookableObject)
        console.log(bookable_object_id, res.data.bookings)
        setBookings(bookable_object_id, res.data.bookings)
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: 'No bookable object found'
        })
        throw new Error('No bookable object found')
      })

    init_loading.value = false
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
    init_loading.value = true

    const { user } = storeToRefs(useUser())

    const objectViewQuery = objectView({ bookable_object_id, isUniqueId, publicView, user_id: user.value.id })
    await client.query<ObjectViewResponse>(objectViewQuery).then(async (res) => {
      if (res.group) {
        await setGroups(res.group)
      }

      if (res.bookable_object.length === 0) {
        if (publicView) {
          throw new Error('No bookable object found')
        }
        toast({
          title: 'Error',
          description: 'No bookable object found'
        })
        throw new Error('No bookable object found')
      }

      if (select) {
        selectBookableObject(res.bookable_object[0])
      }
      addBookableObject(res.bookable_object[0])
      setBookings(bookable_object_id, res.booking)
    })

    init_loading.value = false
  }

  const fetchRequestViewData = async () => {
    init_loading.value = true
    try {
      const query = requestViewQuery({ user_id: user.value.id })
      const res = await client.query<RequestViewResponse>(query)
      setRequests(res.booking)
      await setGroups(res.group)
    } catch (error) {
      console.error(error)
    }
    init_loading.value = false
  }

  const fetchSettingsViewData = async () => {
    init_loading.value = true
    try {
      const query = settingsViewQuery()
      const res = await client.query<SettingsViewResponse>(query)
      await setGroups(res.group)
      setNotificationSettingsExtended(res.notification_setting, res.group, res.bookable_object)
    } catch (error) {
      console.error(error)
    }
    init_loading.value = false
  }

  const fetchGroupData = async () => {
    const { fetchGroupsWithData } = useGroups()
    init_loading.value = true
    await fetchGroupsWithData()
    init_loading.value = false
  }

  return {
    init_loading,
    fetchSettingsViewData,
    fetchDashboardViewData,
    fetchObjectViewData,
    fetchPublicObjectViewData,
    fetchRequestViewData,
    fetchGroupData,
    reset
  }
})
