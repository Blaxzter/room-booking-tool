<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
const localRole = ref(props.role)
const open = ref(false)

watch(localRole, (newRole) => {
  emit('update:role', newRole)
})

const roles = [
  { 
    name: t('groups.utils.groupRoleDropDown.roles.viewer.name'), 
    value: 'viewer', 
    description: t('groups.utils.groupRoleDropDown.roles.viewer.description') 
  },
  { 
    name: t('groups.utils.groupRoleDropDown.roles.member.name'), 
    value: 'member', 
    description: t('groups.utils.groupRoleDropDown.roles.member.description') 
  },
  { 
    name: t('groups.utils.groupRoleDropDown.roles.admin.name'), 
    value: 'admin', 
    description: t('groups.utils.groupRoleDropDown.roles.admin.description') 
  }
]

const displayRoleName = computed(() => {
  const role = roles.find(r => r.value === localRole.value)
  return role ? role.name : localRole.value.charAt(0).toUpperCase() + localRole.value.slice(1)
})
</script>

<template>
  <div v-if="disabled" class="flex items-center me-1.5 border py-1.5 px-3 rounded">
    <span>{{ displayRoleName }}</span>
  </div>
  <Popover v-model:open="open" class="relative" v-else>
    <PopoverTrigger as-child>
      <Button variant="outline">
        {{ displayRoleName }}
        <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0" align="end">
      <Command>
        <CommandInput :placeholder="t('groups.utils.groupRoleDropDown.selectNewRole')" />
        <CommandList>
          <CommandEmpty>{{ t('groups.utils.groupRoleDropDown.noRolesFound') }}</CommandEmpty>
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
