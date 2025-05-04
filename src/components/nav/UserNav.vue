<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import router from '@/router'
import {
  MailIcon,
  LogOutIcon,
  SettingsIcon,
  SunMoonIcon,
  UserIcon
} from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { useUser } from '@/stores/user'
import DarkscreenToggle from '@/components/animations/DarkscreenToggle.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { logout } = useUser()
const { avatar, avatarFallback, name, hasName, email } = storeToRefs(useUser())

const toggleDarkmodeAnimation = ref(false)

onMounted(async () => {
  document.addEventListener('keydown', async (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'L') {
      // ⌘D for MacOS and Ctrl+D for Windows
      e.preventDefault() // Prevent default action of the keypress
      toggleDark()
    }

    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'Q') {
      // ⌘Q for MacOS and Ctrl+Q for Windows
      e.preventDefault() // Prevent default action of the keypress
      await logout()
    }
  })
})

import { useGlobalSettings } from '@/stores/globalSettings'
const { displayLegal, showBuyMeACoffee, isDemoUser, demoDialogOpen } =
  storeToRefs(useGlobalSettings())
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-8 w-8">
          <AvatarImage :src="avatar" alt="User avatar" />
          <AvatarFallback>{{ avatarFallback }}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">{{ name }}</p>
          <p class="text-xs leading-none text-muted-foreground" v-if="hasName">
            {{ email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          @click="router.push({ name: 'settings', params: { tab: 'profile' } })"
          class="cursor-pointer"
        >
          <UserIcon class="mr-2 h-4 w-4" />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="() => toggleDark()"
          class="cursor-pointer my-0 py-0"
          @mouseenter="toggleDarkmodeAnimation = true"
          @mouseleave="toggleDarkmodeAnimation = false"
        >
          <SunMoonIcon class="mr-2 h-4 w-4" />
          <span v-if="isDark">Light mode</span>
          <span v-else>Dark mode</span>
          <div class="flex-grow" />
          <DarkscreenToggle
            :height="30"
            :toggle-animation="toggleDarkmodeAnimation"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="router.push({ name: 'settings', params: { tab: 'account' } })"
          class="cursor-pointer"
        >
          <SettingsIcon class="mr-2 h-4 w-4" />
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator v-if="isDemoUser || showBuyMeACoffee" />
      <template v-if="isDemoUser">
        <DropdownMenuItem class="cursor-pointer" @click="demoDialogOpen = true">
          <MailIcon class="mr-2 h-4 w-4" />
          Request Full Access
        </DropdownMenuItem>
      </template>
      <template v-if="showBuyMeACoffee">
        <DropdownMenuItem>
          <a
            href="https://www.buymeacoffee.com/fabraham"
            target="_blank"
            rel="noopener noreferrer"
            class="flex gap-2"
          >
            <img
              src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
              alt="Buy Freddy a coffee"
              class="buy-me-a-coffee-icon"
            />
            Buy me a coffee
          </a>
        </DropdownMenuItem>
      </template>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout" class="cursor-pointer">
        <LogOutIcon class="mr-2 h-4 w-4" />
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div
        class="text-[10px] text-muted-foreground py-1 text-center"
        v-if="displayLegal"
      >
        <router-link to="/terms-of-service" class="underline">
          Terms of Service
        </router-link>
        &
        <router-link to="/privacy" class="underline">
          Privacy Policy
        </router-link>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
.buy-me-a-coffee-icon {
  width: 1rem;
  height: 1rem;
  transform: scale(1.8);
  margin-right: 0.5rem;
}
</style>
