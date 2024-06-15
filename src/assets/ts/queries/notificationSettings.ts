import type { NotificationSetting } from '@/types'

export const notificationFields = () => {
  return `
    id
    email_notification
    telegram
    bookable_object_id {
        id
        name
    }
    group_id {
        id
        name
    }
  `
}

export const getNotificationSettings = () => `
  notification_setting {
    ${notificationFields()}
  }
`

export const gNotificationRequest = `
  query Notification_setting {
    notification_setting {
        ${notificationFields()}
    }
  }
`

export interface NotificationSettingsGetRequest {
  notification_setting: NotificationSetting[]
}
