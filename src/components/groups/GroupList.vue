<script setup lang="ts">
import { ref, inject } from 'vue'
import { cn } from '@/lib/utils'
import { storeToRefs } from 'pinia'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

import { UsersIcon } from 'lucide-vue-next'

import type { Group } from '@/types'
import { useGroups } from '@/stores/groups'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
const { groups } = storeToRefs(useGroups())

const selectedEditGroup = ref<Group | undefined>(undefined)

const backendUrl = inject('backendUrl')

const nameInitials = (name: string) => {
  if (!name) {
    return ''
  }
  const [firstName, lastName] = name.split(' ')
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }
  return name.charAt(0) + name.charAt(1)
}

defineEmits(['selectGroup'])
</script>

<template>
  <div class="flex gap-2 flex-col" v-if="groups.length !== 0">
    <div
      v-for="group of groups"
      :key="group.id"
      :class="
        cn(
          'flex gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:border-indigo-500/50 cursor-pointer',
          selectedEditGroup?.id === group.id && 'bg-muted'
        )
      "
      @click="
        () => {
          selectedEditGroup = group
          $emit('selectGroup', group)
        }
      "
    >
      <Avatar class="mr-4 h-20 w-20" v-if="!group.emoji || group?.avatar?.id" shape="square">
        <AvatarImage :src="`${backendUrl}/assets/${group?.avatar?.id}`" :alt="group.name" />
        <AvatarFallback>
          {{ nameInitials(group.name) }}
        </AvatarFallback>
      </Avatar>
      <div
        v-else
        class="inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden text-5xl rounded-md mr-4 h-20 w-20"
      >
        {{ group.emoji }}
      </div>

      <div class="flex flex-col items-start w-full gap-1">
        <div class="flex items-center gap-2 justify-between w-full">
          <div class="font-semibold">
            {{ group.name }}
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <span class="text-xl">
              {{ group.users?.length }}
            </span>
            <UsersIcon />
          </div>
        </div>
        <div class="line-clamp-2 text-xs text-muted-foreground">
          {{ group.description }}
        </div>
        <div class="flex items-center gap-2">
          <Badge v-for="objects of group.objects" :key="objects.id" variant="secondary">
            {{ objects.name }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
