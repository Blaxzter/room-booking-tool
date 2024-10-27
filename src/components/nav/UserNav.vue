<script setup lang="ts">
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
import { useDark, useToggle } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/stores/user'
import router from '@/router'
import DarkscreenToggle from '@/components/animations/DarkscreenToggle.vue'
import { useGlobalSettings } from '@/stores/globalSettings'

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

const { displayLegal } = storeToRefs(useGlobalSettings())
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
          <p v-if="hasName" class="text-xs leading-none text-muted-foreground">{{ email }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer" @click="router.push({ name: 'settings', params: { tab: 'profile' } })">
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="cursor-pointer my-0 py-0"
          @click="() => toggleDark()"
          @mouseenter="toggleDarkmodeAnimation = true"
          @mouseleave="toggleDarkmodeAnimation = false"
        >
          <span v-if="isDark">Light mode</span>
          <span v-else>Dark mode</span>
          <div class="flex-grow" />
          <DarkscreenToggle :height="30" :toggle-animation="toggleDarkmodeAnimation" />
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" @click="router.push({ name: 'settings', params: { tab: 'account' } })">
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="logout">
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
      <div v-if="displayLegal" class="text-[10px] text-muted-foreground py-1 text-center">
        <router-link to="/terms-of-service" class="underline"> Terms of Service </router-link>
        &
        <router-link to="/privacy" class="underline"> Privacy Policy </router-link>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
