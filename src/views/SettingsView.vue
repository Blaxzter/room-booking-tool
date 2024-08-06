<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Separator } from '@/components/ui/separator'

import SidebarNav from '@/components/settings/SettingsSidebarNav.vue'
import ProfileForm from '@/components/settings/ProfileForm.vue'
import AccountForm from '@/components/settings/AccountForm.vue'
import NotificationsForm from '@/components/settings/NotificationsForm.vue'

import { useInitialDataStore } from '@/stores/initial'

const { fetchSettingsViewData } = useInitialDataStore()

const router = useRouter()
const route = useRoute()

const selectedPage = ref<string>(route.params.tab as string)
if (!['profile', 'account', 'notifications'].includes(selectedPage.value)) {
  selectedPage.value = 'profile'
  router.replace({ name: 'settings', params: { tab: 'profile' } })
}

const pages: Record<string, any> = {
  profile: ProfileForm,
  account: AccountForm,
  notifications: NotificationsForm
}

const title = computed(() => {
  switch (selectedPage.value) {
    case 'profile':
      return 'Profile'
    case 'account':
      return 'Account'
    case 'notifications':
      return 'Notifications'
  }
  return 'Settings'
})

const description = computed(() => {
  switch (selectedPage.value) {
    case 'profile':
      return 'This is how others will see you on the site.'
    case 'account':
      return 'Update your account settings. Set your preferred language and timezone.'
    case 'notifications':
      return 'Manage your notification settings and set preferences.'
  }
  return 'Manage your account settings and set e-mail preferences.'
})

const PageComponent = computed(() => pages[selectedPage.value])

onMounted(async () => {
  await fetchSettingsViewData()
})
</script>

<template>
  <div class="space-y-6 p-10 pb-16 md:block">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
      <p class="text-muted-foreground">{{ description }}</p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
      <aside class="md:-mx-4 md:w-1/5">
        <SidebarNav v-model="selectedPage" />
      </aside>
      <div class="flex-1 md:max-w-2xl">
        <div class="space-y-6">
          <Component :is="PageComponent" />
        </div>
      </div>
    </div>
  </div>
</template>
