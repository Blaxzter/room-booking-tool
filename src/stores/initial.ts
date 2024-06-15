import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import {
  getDashboardByGroup,
  type GetGroupQueryResponse,
  getInitialDataQuery,
  type GetInitialDataQueryResponse,
  objectView,
  type ObjectViewResponse,
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

  const init_loading = ref(false)

  const fetchDashboardViewData = async () => {
    init_loading.value = true
    try {
      const selectedGroup = getSelectedGroup()
      let received_data = null
      if (!_.isNil(selectedGroup) && selectedGroup !== '-1') {
        const groupQuery = getDashboardByGroup(selectedGroup)
        received_data = await client.query<GetGroupQueryResponse>(groupQuery)

        setBookableObjects({ data: received_data.bookable_object, groupId: selectedGroup })
      } else {
        const initialDataQuery = getInitialDataQuery(user.value.id)
        received_data = await client.query<GetInitialDataQueryResponse>(initialDataQuery)
        setBookableObjects({ data: received_data.bookable_object })
      }

      await setGroups(received_data.group)
    } catch (error) {
      console.error(error)
    }
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

    const objectViewQuery = objectView({ bookable_object_id, isUniqueId, publicView })
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
      setNotificationSettingsExtended(res.notification_settings, res.group, res.bookable_object)
    } catch (error) {
      console.error(error)
    }
    init_loading.value = false
  }

  return { init_loading, fetchSettingsViewData, fetchDashboardViewData, fetchObjectViewData, fetchRequestViewData }
})
