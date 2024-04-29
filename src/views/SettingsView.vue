<script setup lang="ts">
import { computed, ref } from 'vue'
import { Separator } from '@/components/ui/separator'

import SidebarNav from '@/components/settings/SidebarNav.vue'
import ProfileForm from '@/components/settings/ProfileForm.vue'
import AccountForm from '@/components/settings/AccountForm.vue'
import NotificationsForm from '@/components/settings/NotificationsForm.vue'

const selectedPage = ref('profile')

const pages: Record<string, any> = {
  profile: ProfileForm,
  account: AccountForm,
  notifications: NotificationsForm
}

const PageComponent = computed(() => pages[selectedPage.value])
</script>

<template>
  <div class="hidden space-y-6 p-10 pb-16 md:block">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
      <p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <SidebarNav v-model="selectedPage" />
      </aside>
      <div class="flex-1 lg:max-w-2xl">
        <div class="space-y-6">
          <Component :is="PageComponent" />
        </div>
      </div>
    </div>
  </div>
</template>
