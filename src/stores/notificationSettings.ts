import _ from 'lodash'

import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { BookableObject, Group, NotificationSetting } from '@/types'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'
import { deleteItem, updateItem, createItem } from '@directus/sdk'
import { gNotificationRequest, type NotificationSettingsGetRequest } from '@/assets/ts/queries/notificationSettings'

export const useNotificationSetting = defineStore('notificationSetting', () => {
  const { toast } = useToast()
  const { client } = useUser()
  const { user } = storeToRefs(useUser())

  const notificationSettingsLoading = ref(false)

  const userNotificationSetting = ref<NotificationSetting | undefined>(undefined)
  const notificationSettingsByGroup = ref<{ [key: string]: NotificationSetting }>({})
  const notificationSettingsByBookableObject = ref<{ [key: string]: NotificationSetting }>({})

  const defaultNotificationSetting: NotificationSetting = {
    id: undefined,
    user_id: user.value,
    group_id: undefined,
    bookable_object_id: undefined,
    email_notification: true,
    telegram: false
  }

  const setUserNotificationSettings = (notificationSettings: NotificationSetting) => {
    userNotificationSetting.value = notificationSettings
  }

  const setNotificationSettingsByGroup = (group_id: string, notificationSetting: NotificationSetting) => {
    notificationSettingsByGroup.value[group_id] = notificationSetting
  }

  const setNotificationSettingsByBookableObject = (
    bookable_object_id: string,
    notificationSettings: NotificationSetting
  ) => {
    notificationSettingsByBookableObject.value[bookable_object_id] = notificationSettings
  }

  const setNotificationSettings = (notificationSettings: NotificationSetting[]) => {
    notificationSettings.forEach((notificationSetting) => {
      notificationSetting.user_id = user.value
      if (notificationSetting.group_id) {
        if (typeof notificationSetting.group_id !== 'string') {
          setNotificationSettingsByGroup(notificationSetting.group_id.id as string, notificationSetting)
        }
      } else if (notificationSetting.bookable_object_id) {
        if (typeof notificationSetting.bookable_object_id !== 'string') {
          setNotificationSettingsByBookableObject(
            notificationSetting.bookable_object_id.id as string,
            notificationSetting
          )
        }
      } else {
        setUserNotificationSettings(notificationSetting)
      }
    })
  }

  const setNotificationSettingsExtended = (
    notificationSettings: NotificationSetting[],
    groups: Group[],
    bookableObjects: BookableObject[]
  ) => {
    console.log(notificationSettings)
    groups.forEach((group) => {
      const groupSetting = _.find(notificationSettings, (item) => _.get(item, 'group_id.id') === group.id)
      if (groupSetting) {
        setNotificationSettingsByGroup(group.id, groupSetting as NotificationSetting)
      } else {
        const copyOfDefaultNotification = { ...defaultNotificationSetting }
        copyOfDefaultNotification.group_id = group
        setNotificationSettingsByGroup(group.id, copyOfDefaultNotification)
      }
    })

    bookableObjects.forEach((bookableObject) => {
      const objectSetting = _.find(
        notificationSettings,
        (item) => _.get(item, 'bookable_object_id.id') === bookableObject.id
      )
      if (objectSetting) {
        setNotificationSettingsByBookableObject(bookableObject.id, objectSetting as NotificationSetting)
      } else {
        const copyOfDefaultNotification = { ...defaultNotificationSetting }
        copyOfDefaultNotification.bookable_object_id = bookableObject
        setNotificationSettingsByBookableObject(bookableObject.id, copyOfDefaultNotification)
      }
    })

    // find the user notification setting (group_id and bookable_object_id are undefined)
    const userNotificationSetting = _.find(
      notificationSettings,
      (item) => item.bookable_object_id === null && item.group_id === null
    )
    console.log(userNotificationSetting)
    if (userNotificationSetting) {
      setUserNotificationSettings(userNotificationSetting)
    } else {
      setUserNotificationSettings(defaultNotificationSetting)
    }
  }

  const fetchUserNotificationSettings = async () => {
    notificationSettingsLoading.value = true
    await client
      .query<NotificationSettingsGetRequest>(gNotificationRequest)
      .then((res) => {
        setNotificationSettings(res.notification_setting)
        notificationSettingsLoading.value = false
        return res
      })
      .catch((error) => {
        notificationSettingsLoading.value = false
        toast({
          title: 'Error',
          description: error.message
        })
      })
  }

  const updateNotificationSetting = async ({ notificationSetting }: { notificationSetting: NotificationSetting }) => {
    notificationSetting = { ...notificationSetting }
    // replace group and bookable_object with their ids
    if (notificationSetting.group_id && typeof notificationSetting.group_id !== 'string') {
      notificationSetting.group_id = notificationSetting.group_id.id as string
    }
    if (notificationSetting.bookable_object_id && typeof notificationSetting.bookable_object_id !== 'string') {
      notificationSetting.bookable_object_id = notificationSetting.bookable_object_id.id as string
    }
    if (notificationSetting.user_id && typeof notificationSetting.user_id !== 'string') {
      notificationSetting.user_id = notificationSetting.user_id.id as string
    }

    if (notificationSetting.id === undefined) {
      notificationSetting.user_id = user.value.id
      return await client.request(createItem('notification_setting', notificationSetting)).then(() => {
        return true
      })
    }
    return await client
      .request(updateItem('notification_setting', notificationSetting.id, notificationSetting))
      .then(() => {
        return true
      })
  }

  const deleteNotificationSetting = async (notificationSetting: NotificationSetting) => {
    if (notificationSetting.id === undefined) {
      return
    }
    await client.request(deleteItem('notification_setting', notificationSetting.id)).then(() => {
      toast({ variant: 'destructive', title: 'Notification setting deleted' })
    })
  }

  return {
    notificationSettingsLoading,
    userNotificationSetting,
    notificationSettingsByGroup,
    notificationSettingsByBookableObject,
    setNotificationSettingsExtended,
    setUserNotificationSettings,
    setNotificationSettingsByGroup,
    setNotificationSettingsByBookableObject,
    setNotificationSettings,
    fetchUserNotificationSettings,
    updateNotificationSetting,
    deleteNotificationSetting
  }
})
