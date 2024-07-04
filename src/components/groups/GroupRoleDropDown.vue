<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, TrashIcon } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { DialogTrigger } from '@/components/ui/dialog'

const props = defineProps<{
  role: string
}>()
const emit = defineEmits(['update:role', 'deleteUser'])

const localRole = ref(props.role)

watch(localRole, (newRole) => {
  emit('update:role', newRole)
})

const roles = [
  { name: 'Viewer', value: 'viewer', description: 'Can view and comment.' },
  { name: 'Member', value: 'member', description: 'Can view, comment and edit.' },
  { name: 'Admin', value: 'admin', description: 'Admin-level access to all resources.' }
]
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" class="ml-auto">
        {{ localRole }}
        <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0" align="end">
      <Command>
        <CommandInput placeholder="Select new role..." />
        <CommandList>
          <CommandEmpty>No roles found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              :value="r.value"
              :key="r.value"
              class="teamaspace-y-1 flex flex-col items-start px-4 py-2 cursor-pointer"
              v-for="r in roles"
              @select="localRole = r.name"
            >
              <p>{{ r.name }}</p>
              <p class="text-sm text-muted-foreground">{{ r.description }}</p>
            </CommandItem>
          </CommandGroup>
          <Separator />
          <CommandGroup>
            <DialogTrigger as-child>
              <CommandItem
                value="delete"
                class="teamaspace-y-1 flex px-4 cursor-pointer"
                @select="
                  () => {
                    emit('deleteUser')
                  }
                "
              >
                <div class="flex flex-col items-start py-2">
                  <p>Delete</p>
                  <p class="text-sm text-muted-foreground">Remove this user from the group.</p>
                </div>
                <TrashIcon class="h-4 w-4 ms-4 text-red-500" />
              </CommandItem>
            </DialogTrigger>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
