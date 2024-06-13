import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { NotificationSetting } from '@/types'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'
import { deleteItem, updateItem, createItem } from '@directus/sdk'
import { notificationRequest, type NotificationSettingsGetRequest } from '@/assets/ts/queries/notificationSettings'

export const useNotificationSetting = defineStore('notificationSetting', () => {
  const { toast } = useToast()
  const { client } = useUser()
  const { user } = storeToRefs(useUser())

  const notificationSettingsLoading = ref(false)

  const userNotificationSetting = ref<NotificationSetting | undefined>(undefined)
  const notificationSettingsByGroup = ref<{ [key: string]: NotificationSetting }>({})
  const notificationSettingsByBookableObject = ref<{ [key: string]: NotificationSetting }>({})

  const setUserNotificationSettings = (notificationSettings: NotificationSetting) => {
    userNotificationSetting.value = notificationSettings
  }

  const setNotificationSettingsByGroup = (group_id: string, notificationSettings: NotificationSetting) => {
    notificationSettingsByGroup.value[group_id] = notificationSettings
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
        setNotificationSettingsByGroup(notificationSetting.group_id as string, notificationSetting)
      } else if (notificationSetting.bookable_object_id) {
        setNotificationSettingsByBookableObject(notificationSetting.bookable_object_id as string, notificationSetting)
      } else {
        setUserNotificationSettings(notificationSetting)
      }
    })
  }

  const fetchUserNotificationSettings = async () => {
    notificationSettingsLoading.value = true
    await client
      .query<NotificationSettingsGetRequest>(notificationRequest)
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

  const updateNotificationSetting = async (notificationSetting: NotificationSetting) => {
    if (notificationSetting.id === undefined) {
      await client.request(createItem('notification_setting', notificationSetting)).then(() => {
        toast({ variant: 'success', title: 'Notification setting created' })
      })
      return
    }
    await client.request(updateItem('notification_setting', notificationSetting.id, notificationSetting)).then(() => {
      toast({ variant: 'success', title: 'Notification setting updated' })
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
    setUserNotificationSettings,
    setNotificationSettingsByGroup,
    setNotificationSettingsByBookableObject,
    setNotificationSettings,
    fetchUserNotificationSettings,
    updateNotificationSetting,
    deleteNotificationSetting
  }
})
