import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Group } from '@/types'

export const useGroups = defineStore('group', () => {
  const groups = ref<Group[]>([])

  const setGroups = (data: Group[]) => {
    groups.value = data
  }

  const addGroup = (group: Group) => {
    groups.value.push(group)
  }

  return { groups, setGroups, addGroup }
})
