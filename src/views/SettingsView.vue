<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { Separator } from '@/components/ui/separator'

import SidebarNav from '@/components/settings/SettingsSidebarNav.vue'
import ProfileForm from '@/components/settings/ProfileForm.vue'
import AccountForm from '@/components/settings/AccountForm.vue'
import NotificationsForm from '@/components/settings/NotificationsForm.vue'

import { useInitialDataStore } from '@/stores/initial'
import { ScrollArea } from '@/components/ui/scroll-area'

const { fetchSettingsViewData } = useInitialDataStore()
const { t } = useI18n()

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
      return t('settings.profile.title')
    case 'account':
      return t('settings.account.title')
    case 'notifications':
      return t('settings.notifications.title')
  }
  return t('settings.title')
})

const description = computed(() => {
  switch (selectedPage.value) {
    case 'profile':
      return t('settings.profile.description')
    case 'account':
      return t('settings.account.description')
    case 'notifications':
      return t('settings.notifications.description')
  }
  return t('settings.description')
})

const PageComponent = computed(() => pages[selectedPage.value])

onMounted(async () => {
  await fetchSettingsViewData()
})
</script>

<template>
  <div class="space-y-6 p-10 pb-16 h-full max-h-full">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">{{ title }}</h2>
      <p class="text-muted-foreground">{{ description }}</p>
    </div>
    <Separator class="my-6" />
    <div
      class="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0 h-full"
      style="max-height: calc(100% - 50px)"
    >
      <aside class="md:-mx-4 md:w-1/5">
        <SidebarNav v-model="selectedPage" />
      </aside>
      <div class="h-full overflow-hidden flex-grow">
        <ScrollArea class="max-h-full overflow-y-scroll">
          <div class="flex-1 md:max-w-2xl mb-5">
            <div class="space-y-6 ps-1">
              <Component :is="PageComponent" />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</template>
