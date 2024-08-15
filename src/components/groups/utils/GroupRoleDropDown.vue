<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-vue-next'

const props = defineProps({
  role: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:role', 'deleteUser'])

const localRole = ref(props.role)
const open = ref(false)

watch(localRole, (newRole) => {
  emit('update:role', newRole)
})

const roles = [
  { name: 'Viewer', value: 'viewer', description: 'Can view.' },
  { name: 'Member', value: 'member', description: 'Can view and edit.' },
  { name: 'Admin', value: 'admin', description: 'Admin-level access to all resources.' }
]
</script>

<template>
  <div v-if="disabled" class="flex items-center me-1.5 border py-1.5 px-3 rounded">
    <span>{{ localRole.charAt(0).toUpperCase() + localRole.slice(1) }}</span>
  </div>
  <Popover v-model:open="open" class="relative" v-else>
    <PopoverTrigger as-child>
      <Button variant="outline" class="ml-auto">
        {{ localRole.charAt(0).toUpperCase() + localRole.slice(1) }}
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
              class="space-y-1 flex flex-col items-start px-4 py-2 cursor-pointer"
              v-for="r in roles"
              @select="
                () => {
                  localRole = r.value
                  open = false
                }
              "
            >
              <p>{{ r.name }}</p>
              <p class="text-sm text-muted-foreground">{{ r.description }}</p>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
