<script setup lang="ts">
import { inject, ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

import { UsersIcon, BoxIcon, SendIcon, CheckIcon, XIcon, TrashIcon } from 'lucide-vue-next'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import type { Group, GroupInvite, User } from '@/types'
import { useUser } from '@/stores/user'
import { useGroups } from '@/stores/groups'
import type { ShowAlertFunction } from '@/plugins/alert-dialog-plugin'
import { useInitialDataStore } from '@/stores/initial'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

defineProps<{
  group: Group
  showRole: boolean
  isSelected: boolean
  isInvite: boolean
}>()

const emit = defineEmits(['selectGroup'])

const { user } = storeToRefs(useUser())

const groupUser = (group: Group) => {
  return _.filter(group.users, (u) => (u.directus_users_id as User).id !== (group?.owner as { id: string })?.id)
}

const groupRole = (group: Group) => {
  const role = _.find(group.users, (u) => (u.directus_users_id as User).id === user.value.id)?.role
  return role && role.charAt(0).toUpperCase() + role.slice(1)
}

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

const { fetchGroupData } = useInitialDataStore()
const { deleteInvite, addGroupUser } = useGroups()

const acceptInvite = async (group: Group) => {
  const invite = (group.invites as { id: string }[])[0] as GroupInvite
  const userId = (invite.user_id as { id: string }).id
  try {
    await addGroupUser(group.id, userId, 'member').then(async () => {
      // todo -> remove premissions for everyone to create a group user entry
      //      -> make blocking flow -> check for invite of user id
      //      -> remove invite in flow
      //      -> add invite data to fetch data so we can add it to the user in frontend without fetching new data
      await deleteInvite(group, invite.id, false)
      await fetchGroupData()
    })
    emit('selectGroup', group)
  } catch (error) {
    console.error('Error accepting invite:', error)
  }
}

const showAlertDialog = inject('showAlertDialog') as ShowAlertFunction
const rejectInvite = async (group: Group) => {
  showAlertDialog({
    title: 'Reject Invite',
    description: `Are you sure you want to reject the invite for the group "${group.name}"?`,
    onConfirm: async () => {
      // const invite = _.find(group.invites, (i) => (i.user_id as { id: string }).id === user.value.id)
      const invite = (group.invites as { id: string }[])[0]
      const inviteId = invite.id
      try {
        await deleteInvite(group, inviteId, true)
      } catch (error) {
        console.error('Error rejecting invite:', error)
      }
    },
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirmText: 'Reject'
  })
}
</script>

<template>
  <div
    :class="[
      'flex gap-2 rounded-lg border text-left text-sm transition-all overflow-hidden',
      isSelected && 'bg-muted',
      isInvite ? 'p-1' : 'p-1 md:p-2 hover:border-indigo-500/50 cursor-pointer'
    ]"
  >
    <Avatar
      v-if="!group.emoji || group?.avatar?.id"
      shape="square"
      :class="[isInvite ? 'h-12 w-12' : 'w-14 sm:w-20 h-14 sm:h-20']"
    >
      <AvatarImage :src="`${backendUrl}/assets/${group?.avatar?.id}`" :alt="group.name" v-if="group?.avatar?.id" />
      <AvatarFallback>
        {{ nameInitials(group.name) }}
      </AvatarFallback>
    </Avatar>
    <div
      v-else
      class="inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden text-3xl sm:text-5xl rounded-md mr-4 w-14 sm:w-20 h-14 sm:h-20"
      :class="isSelected && 'border border-primary'"
    >
      {{ group.emoji }}
    </div>

    <div class="flex flex-col gap-1 flex-grow overflow-hidden" :class="isInvite ? 'justify-center' : 'justify-between'">
      <div>
        <div class="flex items-center gap-2 justify-between">
          <div class="font-semibold text-nowrap overflow-ellipsis flex-shrink overflow-hidden">
            {{ group.name }}
          </div>
          <div class="flex gap-2 text-muted-foreground flex-shrink-0">
            <Badge v-if="showRole" variant="secondary" :class="isSelected && 'border border-primary'">
              {{ groupRole(group) }}
            </Badge>
            <template v-if="!isInvite">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div class="flex items-center gap-1">
                      <span>
                        {{ groupUser(group)?.length }}
                      </span>
                      <UsersIcon class="w-4 h-4" />
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
                    <div class="flex items-center gap-1">
                      <span>
                        {{ group.invites?.length }}
                      </span>
                      <SendIcon class="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ group.invites?.length }} invites in this group</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </template>
          </div>
        </div>
        <div class="hidden sm:block line-clamp-2 text-xs text-muted-foreground">
          {{ group.description }}
        </div>
      </div>
      <div class="flex items-center gap-2" v-if="!isInvite">
        <BoxIcon class="w-4 h-4 text-muted-foreground" />
        <template v-if="group?.objects !== undefined">
          <ScrollArea>
            <div class="flex flex-nowrap gap-1 text-nowrap">
              <Badge
                variant="secondary"
                :class="isSelected && 'border border-primary'"
                v-for="object of group.objects"
                :key="object.id"
              >
                {{ object.name }}
              </Badge>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </template>
        <div v-else class="text-muted-foreground">No objects</div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button v-if="isInvite" @click.stop="acceptInvite(group)" variant="ghost" size="icon">
        <CheckIcon class="text-success" />
      </Button>
      <Button v-if="isInvite" @click.stop="rejectInvite(group)" variant="ghost" size="icon">
        <XIcon class="text-destructive" />
      </Button>
    </div>
  </div>
</template>
