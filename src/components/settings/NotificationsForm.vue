<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

import { useNotificationSetting } from '@/stores/notificationSettings'
import type { NotificationSetting } from '@/types'

const {
  notificationSettingsLoading,
  userNotificationSetting,
  notificationSettingsByGroup,
  notificationSettingsByBookableObject
} = storeToRefs(useNotificationSetting())

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
    <div class="space-y-8 relative">
      <template v-if="!notificationSettingsLoading">
        <!-- Column Indicators -->
        <div class="grid grid-cols-3 gap-4">
          <div></div>
          <div class="font-semibold">Email</div>
          <div class="font-semibold">Telegram</div>
        </div>
        <Separator />

        <!-- User Notification Settings -->
        <div class="grid grid-cols-3 gap-4 items-center">
          <div class="font-semibold">User Name</div>
          <Checkbox
            v-model="currentUserNotificationSetting.email_notification"
            @change="toggleNotification(currentUserNotificationSetting, 'email_notification')"
          />
          <Checkbox
            v-model="currentUserNotificationSetting.telegram"
            @change="toggleNotification(currentUserNotificationSetting, 'telegram')"
          />
        </div>
        <Separator />

        <!-- Group Notification Settings -->
        <div>
          <div class="font-semibold">Groups</div>
          <div v-for="group in notificationSettingsByGroup" :key="group.id" class="grid grid-cols-3 gap-4 items-center">
            <div>{{ group.group_id }}</div>
            <Checkbox v-model="group.email_notification" @change="toggleNotification(group, 'email_notification')" />
            <Checkbox v-model="group.telegram" @change="toggleNotification(group, 'telegram')" />
          </div>
        </div>
        <Separator />

        <!-- Bookable Objects Notification Settings -->
        <div>
          <div class="font-semibold">Bookable Objects</div>
          <div
            v-for="object in notificationSettingsByBookableObject"
            :key="object.id"
            class="grid grid-cols-3 gap-4 items-center"
          >
            <div>{{ object.bookable_object_id }}</div>
            <Checkbox v-model="object.email_notification" @change="toggleNotification(object, 'email_notification')" />
            <Checkbox v-model="object.telegram" @change="toggleNotification(object, 'telegram')" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
