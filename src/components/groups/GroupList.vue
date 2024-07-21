<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { cn } from '@/lib/utils'
import _ from 'lodash'

import { Badge } from '@/components/ui/badge'

import { UsersIcon, BoxIcon, SendIcon } from 'lucide-vue-next'

import type { Group, User } from '@/types'
import { useGroups } from '@/stores/groups'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
const { groups } = storeToRefs(useGroups())

import { useUser } from '@/stores/user'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const { user } = storeToRefs(useUser())

const groupUser = (group: Group) => {
  return _.filter(group.users, (u) => (u.directus_users_id as User).id !== (group?.owner as { id: string })?.id)
}

// create a computed that are the groups the user is owner of
const ownedGroups = computed(() => {
  return groups.value.filter((group) => (group.owner as { id: string })?.id === user.value.id)
})

const invitedGroups = computed(() => {
  return groups.value.filter((group) => (group.owner as { id: string })?.id !== user.value.id)
})

const groupIterative = ref([
  {
    title: 'Your Groups',
    groups: ownedGroups
  },
  {
    title: 'Invited Groups',
    groups: invitedGroups
  }
])

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
    <template v-for="groupType in groupIterative" :key="groupType.title">
      <div class="font-semibold text-lg text-primary mt-3">{{ groupType.title }}</div>
      <div
        v-for="group of groupType.groups"
        :key="group.id"
        :class="
          cn(
            'flex gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:border-indigo-500/50 cursor-pointer justify-stretch',
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
        <Avatar
          class="mr-4 h-20 w-20"
          v-if="!group.emoji || group?.avatar?.id"
          shape="square"
          :class="selectedEditGroup?.id === group.id && 'border border-primary'"
        >
          <AvatarImage :src="`${backendUrl}/assets/${group?.avatar?.id}`" :alt="group.name" v-if="group?.avatar?.id" />
          <AvatarFallback>
            {{ nameInitials(group.name) }}
          </AvatarFallback>
        </Avatar>
        <div
          v-else
          class="inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden text-5xl rounded-md mr-4 h-20 w-20"
          :class="selectedEditGroup?.id === group.id && 'border border-primary'"
        >
          {{ group.emoji }}
        </div>

        <div class="flex flex-col w-full gap-1 justify-between">
          <div>
            <div class="flex items-center gap-2 justify-between">
              <div class="font-semibold">
                {{ group.name }}
              </div>
              <div class="flex gap-4 text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div class="flex items-center gap-2">
                        <span class="text-xl">
                          {{ groupUser(group)?.length }}
                        </span>
                        <UsersIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ groupUser(group)?.length }} users in this group</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div class="flex items-center gap-2">
                        <span class="text-xl">
                          {{ group.invites?.length }}
                        </span>
                        <SendIcon />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ group.invites?.length }} invites in this group</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div class="line-clamp-2 text-xs text-muted-foreground">
              {{ group.description }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <BoxIcon class="w-4 h-4 text-muted-foreground" />
            <template v-if="group?.objects !== undefined">
              <Badge
                v-for="objects of group.objects"
                :key="objects.id"
                variant="secondary"
                :class="selectedEditGroup?.id === group.id && 'border border-primary'"
              >
                {{ objects.name }}
              </Badge>
            </template>
            <div v-else class="text-muted-foreground">No objects</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
