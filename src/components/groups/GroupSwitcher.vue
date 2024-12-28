<script setup lang="ts">
import { computed, type ComputedRef, inject, ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

import { LoaderIcon, Edit2Icon } from 'lucide-vue-next'
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-icons/vue'
import router from '@/router'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import type { Group } from '@/types'
import { useUser } from '@/stores/user'
import { useGroups } from '@/stores/groups'

import NewGroupDialog from '@/components/groups/dialogs/NewGroupDialog.vue'
import GroupMemberDialog from '@/components/groups/dialogs/GroupMemberDialog.vue'

type GroupsDisplayData = { label: string; teams: Group[] }[]

const groupStore = useGroups()
const userStore = useUser()
const { user, avatarId } = storeToRefs(userStore)
const { selectGroup } = groupStore
const { groups, selectedGroupId } = storeToRefs(groupStore)

const backendUrl = inject('backendUrl')

const userName = () => {
  if (user.value) {
    if (user.value.first_name || user.value.last_name) {
      return `${user.value.first_name} ${user.value.last_name}`
    }
    return user.value.email
  }
  return 'Unknown'
}

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

const nameShort = (name: string) => {
  if (!name) {
    return ''
  }
  const [firstName, lastName] = name.split(' ')
  if (firstName && lastName) {
    let shortendFirstName = firstName
    if (firstName.length > 8) {
      shortendFirstName = firstName.slice(0, 8) + '.'
    }
    return `${shortendFirstName} ${lastName.charAt(0)}.`
  }
  return name
}

const displayData: ComputedRef<GroupsDisplayData> = computed(() => {
  return [
    {
      label: 'Personal Account',
      teams: [
        {
          id: '-1',
          name: userName(),
          avatar: { id: avatarId.value },
          description: 'personal'
        }
      ]
    },
    {
      label: 'Groups',
      teams: _.map(
        groups.value,
        (group: Group): Group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          emoji: group.emoji
        })
      )
    }
  ] as GroupsDisplayData
})

const open = ref(false)
const showDialog = ref(false)
const dialogType = ref('create-group')

const selectedTeam = computed(() => {
  if (selectedGroupId.value != null && selectedGroupId.value !== '-1') {
    const find = _.find(groups.value, { id: `${selectedGroupId.value}` })
    if (find) return find
  }
  return displayData.value[0].teams[0]
})

const filterGroups = (
  val: string[] | number[] | Record<string, any>[] | false[] | true[],
  term: string
): string[] | number[] | Record<string, any>[] | false[] | true[] => {
  return val.filter((group, index) => {
    if (index === val.length - 2) {
      return true
    }
    return (group as Group).name.toLowerCase().includes(term.toLowerCase())
  }) as Record<string, any>[]
}

const groupClicked = async (team: Group) => {
  // todo check what happens on selecting the user name (all)
  await selectGroup(team)
  open.value = false
}

const createdGroup = ref<Group | undefined>(undefined)
const created = async (group: Group) => {
  dialogType.value = 'invite-dialog'
  createdGroup.value = group
  await selectGroup(group)
}
</script>

<template>
  <Dialog v-model:open="showDialog">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="true"
          aria-label="Select a team"
          :class="cn('sm:w-[200px] justify-between', $attrs.class ?? '')"
          v-if="selectedTeam"
        >
          <Avatar class="mr-2 h-5 w-5" v-if="!selectedTeam.emoji || selectedTeam?.avatar?.id">
            <AvatarImage :src="`${backendUrl}/assets/${selectedTeam?.avatar?.id}`" :alt="selectedTeam.name" />
            <AvatarFallback>
              {{ nameInitials(selectedTeam.name) }}
            </AvatarFallback>
          </Avatar>
          <div v-else class="me-2 w-[20px] h-[20px]">
            {{ selectedTeam.emoji }}
          </div>
          <div class="whitespace-nowrap overflow-ellipsis overflow-hidden hidden sm:block sm:w-[150px]">
            {{ selectedTeam.name }}
          </div>
          <div class="whitespace-nowrap overflow-ellipsis overflow-hidden sm:hidden">
            {{ nameShort(selectedTeam.name) }}
          </div>
          <CaretSortIcon class="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <LoaderIcon v-else className="animate-spin" />
      </PopoverTrigger>
      <PopoverContent class="w-[200px] p-0">
        <Command :filter-function="filterGroups">
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup v-for="group in displayData" :key="group.label" :heading="group.label">
              <CommandItem
                v-for="team in group.teams"
                :key="team.name"
                :value="team"
                class="text-sm cursor-pointer"
                @select="groupClicked(team)"
              >
                <Avatar class="mr-2 h-5 w-5" v-if="!team.emoji || team?.avatar?.id">
                  <AvatarImage :src="`${backendUrl}/assets/${team?.avatar?.id}`" :alt="team.name" />
                  <AvatarFallback>
                    {{ nameInitials(team.name) }}
                  </AvatarFallback>
                </Avatar>
                <div v-else class="me-2 w-[20px] h-[20px]">
                  {{ team.emoji }}
                </div>
                <div class="whitespace-nowrap overflow-ellipsis overflow-hidden w-[120px]">
                  {{ team.name }}
                </div>
                <CheckIcon :class="cn('ml-auto h-4 w-4', selectedTeam?.id === team.id ? 'opacity-100' : 'opacity-0')" />
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <DialogTrigger as-child>
                <CommandItem
                  value="create-group"
                  class="cursor-pointer"
                  @select="
                    () => {
                      open = false
                      showDialog = true
                      dialogType = 'create-group'
                    }
                  "
                >
                  <PlusCircledIcon class="mr-2 h-5 w-5" />
                  Create Group
                </CommandItem>
              </DialogTrigger>
              <CommandItem
                class="cursor-pointer"
                value="edit-group"
                @select.stop="
                  () => {
                    open = false
                    router.push({ name: 'groups' })
                  }
                "
              >
                <Edit2Icon class="mr-2 h-5 w-5" />
                Manage Groups
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <NewGroupDialog @close="showDialog = false" v-if="dialogType === 'create-group'" @created="created" />
    <GroupMemberDialog @close="showDialog = false" v-if="dialogType === 'invite-dialog'" :group="createdGroup" />
  </Dialog>
</template>
