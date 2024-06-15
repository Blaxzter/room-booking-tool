<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

import { useUser } from '@/stores/user'
import { useNotificationSetting } from '@/stores/notificationSettings'
import type { NotificationSetting } from '@/types'

const {
  notificationSettingsLoading,
  userNotificationSetting,
  notificationSettingsByGroup,
  notificationSettingsByBookableObject
} = storeToRefs(useNotificationSetting())

const { userName } = storeToRefs(useUser())

const { fetchUserNotificationSettings, updateNotificationSetting } = useNotificationSetting()

const toggleNotification = (setting: NotificationSetting, type: string) => {
  // Toggle the notification setting based on type (email or telegram)
  if (type === 'email_notification') {
    setting.email_notification = !setting.email_notification
  } else if (type === 'telegram') {
    setting.telegram = !setting.telegram
  }
  updateNotificationSetting(setting)
}

const currentUserNotificationSetting = ref<NotificationSetting>({
  id: undefined,
  email_notification: false,
  telegram: false
})

onMounted(async () => {
  await fetchUserNotificationSettings()
  if (userNotificationSetting.value) {
    currentUserNotificationSetting.value = userNotificationSetting.value
  }
})
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Notifications</h3>
    <p class="text-sm text-muted-foreground">Configure how you receive notifications.</p>
  </div>
  <Separator />
  <div class="space-y-8 relative">
    <div class="space-y-4 relative">
      <template v-if="!notificationSettingsLoading">
        <!-- Column Indicators -->
        <div class="grid gap-4 grid-cols-[1fr_100px_100px] place-items-center">
          <div></div>
          <div class="font-semibold">Email</div>
          <div class="font-semibold">Telegram</div>
        </div>
        <Separator />

        <!-- User Notification Settings -->
        <div class="grid grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center">
          <div class="font-semibold place-self-start">{{ userName }}</div>
          <Checkbox
            :checked="currentUserNotificationSetting.email_notification"
            @update:checked="toggleNotification(currentUserNotificationSetting, 'email_notification')"
          />
          <Checkbox
            :checked="currentUserNotificationSetting.telegram"
            @update:checked="toggleNotification(currentUserNotificationSetting, 'telegram')"
          />
        </div>
        <Separator />

        <!-- Group Notification Settings -->
        <div class="font-semibold">Groups</div>
        <div class="space-y-0.5 ps-3">
          <div
            v-for="group in notificationSettingsByGroup"
            :key="group.id"
            class="grid grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center"
          >
            <template v-if="group.group_id">
              <div class="place-self-start">{{ group.group_id.name }}</div>
              <Checkbox
                :checked="group.email_notification"
                @update:checked="toggleNotification(group, 'email_notification')"
              />
              <Checkbox :checked="group.telegram" @update:checked="toggleNotification(group, 'telegram')" />
            </template>
          </div>
        </div>
        <Separator />

        <!-- Bookable Objects Notification Settings -->
        <div class="font-semibold">Bookable Objects</div>
        <div class="space-y-0.5 ps-3">
          <div
            v-for="object in notificationSettingsByBookableObject"
            :key="object.id"
            class="grid grid-cols-[1fr_100px_100px] gap-4 items-center place-items-center"
          >
            <template v-if="object.bookable_object_id">
              <div class="place-self-start">{{ object.bookable_object_id.name }}</div>
              <Checkbox
                :checked="object.email_notification"
                @update:checked="toggleNotification(object, 'email_notification')"
              />
              <Checkbox :checked="object.telegram" @update:checked="toggleNotification(object, 'telegram')" />
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
