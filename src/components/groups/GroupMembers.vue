<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next'

import type { Group } from '@/types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

defineProps<{
  group: Group | undefined
}>()

const sofiaRole = ref('Owner')
const jacksonRole = ref('Member')
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Team Members</DialogTitle>
      <DialogDescription> Invite your team members to collaborate. </DialogDescription>
    </DialogHeader>
    <div class="grid gap-6">
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium leading-none">Sofia Davis</p>
            <p class="text-sm text-muted-foreground">m@example.com</p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="ml-auto">
              {{ sofiaRole }}
              <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="p-0" align="end">
            <Command v-model="sofiaRole">
              <CommandInput placeholder="Select new role..." />
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="Viewer" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Viewer</p>
                    <p class="text-sm text-muted-foreground">Can view and comment.</p>
                  </CommandItem>
                  <CommandItem value="Developer" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Developer</p>
                    <p class="text-sm text-muted-foreground">Can view, comment and edit.</p>
                  </CommandItem>
                  <CommandItem value="Billing" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Billing</p>
                    <p class="text-sm text-muted-foreground">Can view, comment and manage billing.</p>
                  </CommandItem>
                  <CommandItem value="Owner" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Owner</p>
                    <p class="text-sm text-muted-foreground">Admin-level access to all resources.</p>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div class="flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/02.png" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium leading-none">Jackson Lee</p>
            <p class="text-sm text-muted-foreground">p@example.com</p>
          </div>
        </div>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="ml-auto">
              {{ jacksonRole }}
              <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="p-0" align="end">
            <Command v-model="jacksonRole">
              <CommandInput placeholder="Select new role..." />
              <CommandList>
                <CommandEmpty>No roles found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="Viewer" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Viewer</p>
                    <p class="text-sm text-muted-foreground">Can view and comment.</p>
                  </CommandItem>
                  <CommandItem value="Developer" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Developer</p>
                    <p class="text-sm text-muted-foreground">Can view, comment and edit.</p>
                  </CommandItem>
                  <CommandItem value="Billing" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Billing</p>
                    <p class="text-sm text-muted-foreground">Can view, comment and manage billing.</p>
                  </CommandItem>
                  <CommandItem value="Owner" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                    <p>Owner</p>
                    <p class="text-sm text-muted-foreground">Admin-level access to all resources.</p>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </DialogContent>
</template>
