<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { MailIcon, SendIcon } from 'lucide-vue-next'

import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

import { useUser } from '@/stores/user'
import { useNotificationSetting } from '@/stores/notificationSettings'
import { useToast } from '@/components/ui/toast'

import type { NotificationSetting } from '@/types'

const { t } = useI18n()
const {
  notificationSettingsLoading,
  userNotificationSetting,
  notificationSettingsByGroup,
  notificationSettingsByBookableObject
} = storeToRefs(useNotificationSetting())
const { userName } = storeToRefs(useUser())
const { updateNotificationSetting } = useNotificationSetting()
type NotificationType = 'email_notification' | 'telegram'

const typeToOrigin: { [key in NotificationType]: string } = {
  email_notification: t('settings.notifications.types.email'),
  telegram: t('settings.notifications.types.telegram')
}

const toggleNotification = async (setting: NotificationSetting, type: NotificationType, origin: string) => {
  // Toggle the notification setting based on type (email or telegram)
  if (type === 'email_notification') {
    setting.email_notification = !setting.email_notification
  } else if (type === 'telegram') {
    setting.telegram = !setting.telegram
  }
  await updateNotificationSetting({
    notificationSetting: setting
  }).then(() => {
    const { toast } = useToast()
    toast({
      variant: 'success',
      title: t('settings.notifications.toast.title'),
      description: t('settings.notifications.toast.description', { origin, type: typeToOrigin[type] })
    })
  })
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">{{ t('settings.notifications.title') }}</h3>
    <p class="text-sm text-muted-foreground">{{ t('settings.notifications.description') }}</p>
  </div>
  <Separator />
  <div class="space-y-8 relative">
    <div class="space-y-4 relative">
      <template v-if="!notificationSettingsLoading">
        <!-- Column Indicators -->
        <div class="grid gap-4 grid-cols-[1fr_50px_50px] md:grid-cols-[1fr_100px_100px] place-items-center">
          <div></div>
          <div class="font-semibold">
            <div class="flex flex-col items-center space-x-1">
              <MailIcon class="h-4 w-4" />
              <span class="hidden md:inline">{{ t('settings.notifications.types.email') }}</span>
            </div>
          </div>
          <div class="font-semibold">
            <div class="flex flex-col items-center space-x-1">
              <SendIcon class="h-4 w-4" />
              <span class="hidden md:inline">{{ t('settings.notifications.types.telegram') }}</span>
            </div>
          </div>
        </div>
        <Separator />

        <!-- User Notification Settings -->
        <div
          class="grid grid-cols-[1fr_50px_50px] md:grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center"
        >
          <template v-if="userNotificationSetting">
            <div class="font-semibold place-self-start">{{ userName }}</div>
            <Checkbox
              :checked="userNotificationSetting.email_notification"
              @update:checked="toggleNotification(userNotificationSetting, 'email_notification', 'User')"
            />
            <Checkbox
              :checked="userNotificationSetting.telegram"
              @update:checked="toggleNotification(userNotificationSetting, 'telegram', 'User')"
            />
          </template>
        </div>
        <div class="text-muted-foreground">
          {{ t('settings.notifications.userOverrideHelp') }}
        </div>

        <Separator />

        <!-- Group Notification Settings -->
        <div class="font-semibold">{{ t('settings.notifications.groups.title') }}</div>
        <div class="space-y-0.5 ps-3">
          <div
            v-for="group in notificationSettingsByGroup"
            :key="group.id"
            class="grid grid-cols-[1fr_50px_50px] md:grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center"
          >
            <template v-if="group.group_id && typeof group.group_id !== 'string'">
              <div class="place-self-start">{{ group.group_id.name }}</div>
              <Checkbox
                :checked="group.email_notification"
                @update:checked="toggleNotification(group, 'email_notification', `Group ${group.group_id.name}`)"
              />
              <Checkbox :checked="group.telegram" @update:checked="toggleNotification(group, 'telegram', 'User')" />
            </template>
          </div>
        </div>
        <div class="text-muted-foreground max-w-[600px]">
          {{ t('settings.notifications.groups.help') }}
        </div>
        <Separator />

        <!-- Bookable Objects Notification Settings -->
        <div class="font-semibold">{{ t('settings.notifications.bookableObjects.title') }}</div>
        <div class="space-y-0.5 ps-3">
          <div
            v-for="object in notificationSettingsByBookableObject"
            :key="object.id"
            class="grid grid-cols-[1fr_50px_50px] md:grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center"
          >
            <template v-if="object.bookable_object_id && typeof object.bookable_object_id !== 'string'">
              <div class="place-self-start">{{ object.bookable_object_id.name }}</div>
              <Checkbox
                :checked="object.email_notification"
                @update:checked="
                  toggleNotification(object, 'email_notification', `Bookable Object ${object.bookable_object_id.name}`)
                "
              />
              <Checkbox
                :checked="object.telegram"
                @update:checked="
                  toggleNotification(object, 'telegram', `Bookable Object ${object.bookable_object_id.name}`)
                "
              />
            </template>
          </div>
        </div>
        <div class="text-muted-foreground max-w-[500px]">
          {{ t('settings.notifications.bookableObjects.help') }}
        </div>
      </template>
    </div>
  </div>
</template>
