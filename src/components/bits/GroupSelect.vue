<script setup lang="ts">
import { defineProps, onMounted, computed, ref, type PropType } from 'vue'
import { storeToRefs } from 'pinia'

import { FormControl } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { Group } from '@/types'

import { useGroups } from '@/stores/groups'
import { useAuth } from '@/stores/auth'

const { name } = storeToRefs(useAuth())

const { selectedGroupId, groups } = storeToRefs(useGroups())

const group = ref<string | undefined>(undefined)

const emit = defineEmits(['input', 'blur', 'change'])

const props = defineProps({
  includePerson: {
    type: Boolean,
    default: false
  }
})

import { useAttrs } from 'vue'

const attrs = useAttrs()

if (Object.keys(attrs).length > 0) {
  console.log('Attrs has values:', attrs)
} else {
  console.log('Attrs is empty')
}

const combindedGroups = computed(() => {
  if (props.includePerson) {
    return [{ id: '-1', name: name.value }, ...groups.value]
  }
  return groups
}) as unknown as Group[]

const getInitialGroup = () => {
  if (Object.keys(attrs).length > 0 && attrs['modelValue'] !== undefined) {
    return attrs['modelValue']
  } else if (selectedGroupId.value) {
    return selectedGroupId.value
  } else if (props.includePerson) {
    return '-1'
  } else if (groups.value.length > 0) {
    return groups.value[0].id
  }
  console.error('GroupSelect: No group selected')
  return undefined
}

onMounted(() => {
  group.value = getInitialGroup()
  if (group.value) {
    console.log('Emited group')
    emit('input', group.value)
  }
  console.log('GroupSelect', group.value)
})
</script>

<template>
  <Select v-model="group" v-bind="$attrs">
    <FormControl>
      <SelectTrigger>
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="group in combindedGroups" :key="group.id" :value="group.id">
          {{ group.name }}
          <div v-if="group.id === '-1'" class="text-muted-foreground text-xs">Personal</div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
