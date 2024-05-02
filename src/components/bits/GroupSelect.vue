<script setup lang="ts">
import { defineProps, onMounted } from 'vue'

import { FormControl } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useGroups } from '@/stores/groups'

const { groups } = useGroups()

const props = defineProps({
  selectedGroup: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  const selectedGroup = props.selectedGroup
  console.log('GroupSelect', selectedGroup)
})
</script>

<template>
  <Select v-bind="selectedGroup">
    <FormControl>
      <SelectTrigger>
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="group in groups" :key="group.id" :value="group.id">
          {{ group.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
