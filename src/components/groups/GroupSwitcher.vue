<script setup lang="ts">
import { computed, type ComputedRef, ref, watch } from 'vue'
import _ from 'lodash'
import { CaretSortIcon } from '@radix-icons/vue'
import { CheckIcon } from '@radix-icons/vue'
import { PlusCircledIcon } from '@radix-icons/vue'

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import type { Group } from '@/types'
import NewGroupDialog from '@/components/groups/NewGroupDialog.vue'
import { useAuth } from '@/stores/auth'
import { useGroups } from '@/stores/groups'
import { storeToRefs } from 'pinia'

type GroupsDisplayData = { label: string; teams: Group[] }[]

const groupStore = useGroups()
const authStore = useAuth()
const { user } = storeToRefs(authStore)
const { selectGroup } = groupStore
const { groups, selectedGroup } = storeToRefs(groupStore)

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
  const [firstName, lastName] = name.split(' ')
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }
  return name.charAt(0) + name.charAt(1)
}

const displayData: ComputedRef<GroupsDisplayData> = computed(() => {
  return [
    {
      label: 'Personal Account',
      teams: [
        {
          id: 1,
          name: userName(),
          description: 'personal'
        }
      ]
    },
    {
      label: 'Groups',
      teams: _.map(
        groups.value,
        (group: Group): Group => ({
          id: Number(group.id),
          name: group.name,
          description: group.description
        })
      )
    }
  ]
})

const open = ref(false)
const showNewTeamDialog = ref(false)
let selectedTeam = computed(() => {
  if (selectedGroup.value != null) {
    return selectedGroup.value
  }
  return displayData.value[0].teams[0]
})

const filterGroups = (
  val: Record<string, any>[],
  term: string
): Record<string, any>[] => {
  return val.filter((group, index) => {
    if (index === val.length - 1) {
      return true
    }
    return group.name.toLowerCase().includes(term.toLowerCase())
  })
}
</script>

<template>
  <Dialog v-model:open="showNewTeamDialog">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="true"
          aria-label="Select a team"
          :class="cn('w-[200px] justify-between', $attrs.class ?? '')"
        >
          <Avatar class="mr-2 h-5 w-5">
            <AvatarImage
              :src="`${selectedTeam.avatar}`"
              :alt="selectedTeam.name"
            />
            <AvatarFallback>{{
              nameInitials(selectedTeam.name)
            }}</AvatarFallback>
          </Avatar>
          <div
            class="whitespace-nowrap overflow-ellipsis overflow-hidden w-[150px]"
          >
            {{ selectedTeam.name }}
          </div>
          <CaretSortIcon class="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[200px] p-0">
        <Command :filter-function="filterGroups">
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup
              v-for="group in displayData"
              :key="group.label"
              :heading="group.label"
            >
              <CommandItem
                v-for="team in group.teams"
                :key="team.name"
                :value="team"
                class="text-sm"
                @select="
                  () => {
                    selectGroup(team)
                    open = false
                  }
                "
              >
                <Avatar class="mr-2 h-5 w-5">
                  <AvatarImage
                    :src="`${team.avatar}`"
                    :alt="team.name"
                    class="grayscale"
                  />
                  <AvatarFallback>{{ nameInitials(team.name) }}</AvatarFallback>
                </Avatar>
                <div
                  class="whitespace-nowrap overflow-ellipsis overflow-hidden w-[120px]"
                >
                  {{ team.name }}
                </div>
                <CheckIcon
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      selectedTeam.id === team.id ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <DialogTrigger as-child>
                <CommandItem
                  value="create-group"
                  @select="
                    () => {
                      open = false
                      showNewTeamDialog = true
                    }
                  "
                >
                  <PlusCircledIcon class="mr-2 h-5 w-5" />
                  Create Group
                </CommandItem>
              </DialogTrigger>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <NewGroupDialog @close="showNewTeamDialog = false" />
  </Dialog>
</template>
