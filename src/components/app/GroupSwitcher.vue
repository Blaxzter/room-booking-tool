<script setup lang="ts">
import { ref } from 'vue'
import { CaretSortIcon } from '@radix-icons/vue'
import { CheckIcon } from '@radix-icons/vue'
import { PlusCircledIcon } from '@radix-icons/vue'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Group } from '@/types'

type Groups = { label: string; teams: Group[] }[]
const groups: Groups = [
  {
    label: 'Personal Account',
    teams: [
      {
        id: 1,
        name: 'Alicia Koch',
        description: 'personal'
      }
    ]
  },
  {
    label: 'Teams',
    teams: [
      {
        id: 2,
        name: 'Acme Inc.',
        description: 'acme-inc'
      },
      {
        id: 3,
        name: 'Monsters Inc.',
        description: 'monsters'
      }
    ]
  }
]

const open = ref(false)
const showNewTeamDialog = ref(false)
const selectedTeam = ref<Group>(groups[0].teams[0])

const nameInitials = (name: string) => {
  const [firstName, lastName] = name.split(' ')
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }
  return name.charAt(0) + name.charAt(1)
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
            <AvatarImage :src="`${selectedTeam.avatar}`" :alt="selectedTeam.name" />
            <AvatarFallback>{{ nameInitials(selectedTeam.name) }}</AvatarFallback>
          </Avatar>
          {{ selectedTeam.name }}
          <CaretSortIcon class="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[200px] p-0">
        <Command
          :filter-function="
            (list: Group[], term: string): Group[] =>
              list.filter((i: Group) => i.name?.toLowerCase()?.includes(term))
          "
        >
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup v-for="group in groups" :key="group.label" :heading="group.label">
              <CommandItem
                v-for="team in group.teams"
                :key="team.name"
                :value="team"
                class="text-sm"
                @select="
                  () => {
                    selectedTeam = team
                    open = false
                  }
                "
              >
                <Avatar class="mr-2 h-5 w-5">
                  <AvatarImage :src="`${team.avatar}`" :alt="team.name" class="grayscale" />
                  <AvatarFallback>{{ nameInitials(team.name) }}</AvatarFallback>
                </Avatar>
                {{ team.name }}
                <CheckIcon
                  :class="
                    cn('ml-auto h-4 w-4', selectedTeam.id === team.id ? 'opacity-100' : 'opacity-0')
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
                  value="create-team"
                  @select="
                    () => {
                      open = false
                      showNewTeamDialog = true
                    }
                  "
                >
                  <PlusCircledIcon class="mr-2 h-5 w-5" />
                  Create Team
                </CommandItem>
              </DialogTrigger>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create team</DialogTitle>
        <DialogDescription> Add a new team to manage products and customers. </DialogDescription>
      </DialogHeader>
      <div>
        <div class="space-y-4 py-2 pb-4">
          <div class="space-y-2">
            <Label for="name">Team name</Label>
            <Input id="name" placeholder="Acme Inc." />
          </div>
          <div class="space-y-2">
            <Label for="plan">Subscription plan</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <span class="font-medium">Free</span> -
                  <span class="text-muted-foreground"> Trial for two weeks </span>
                </SelectItem>
                <SelectItem value="pro">
                  <span class="font-medium">Pro</span> -
                  <span class="text-muted-foreground"> $9/month per user </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="showNewTeamDialog = false"> Cancel </Button>
        <Button type="submit"> Continue </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
