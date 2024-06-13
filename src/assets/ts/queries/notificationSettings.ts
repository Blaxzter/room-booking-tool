import type { NotificationSetting } from '@/types'

export const notificationRequest = `
  query Notification_setting {
    notification_setting {
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
    }
  }
`

export interface NotificationSettingsGetRequest {
  notification_setting: NotificationSetting[]
}
