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

const isDark = useDark()
const toggleDark = useToggle(isDark)

import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/stores/auth'
import router from '@/router'
import DarkscreenToggle from '@/components/animations/DarkscreenToggle.vue'

const { logout } = useAuth()
const { user } = storeToRefs(useAuth())

const toggleDarkmodeAnimation = ref(false)

const userName = computed(() => user.value?.first_name + ' ' + user.value?.last_name)
const email = computed(() => user.value?.email)
const avatar = computed(() => user.value?.avatar ?? '')
const avatarFallback = computed(() => user.value?.first_name?.charAt(0) + user.value?.last_name?.charAt(0))

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
          <p class="text-sm font-medium leading-none">{{ userName }}</p>
          <p class="text-xs leading-none text-muted-foreground">{{ email }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="router.push({ name: 'settings', params: { tab: 'profile' } })" class="cursor-pointer">
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          @click="() => toggleDark()"
          class="cursor-pointer my-0 py-0"
          @mouseenter="toggleDarkmodeAnimation = true"
          @mouseleave="toggleDarkmodeAnimation = false"
        >
          <span v-if="isDark">Light mode</span>
          <span v-else>Dark mode</span>
          <div class="flex-grow" />
          <DarkscreenToggle :height="30" :toggle-animation="toggleDarkmodeAnimation" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="router.push({ name: 'settings', params: { tab: 'account' } })" class="cursor-pointer">
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout">
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
