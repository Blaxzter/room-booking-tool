import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type { Group } from '@/types'

export const useGroups = defineStore('group', () => {
  const selectedGroup = ref<Group | null>(null)

  const groups = ref<Group[]>([])

  const selectGroup = (group: Group) => {
    console.log('selecting group', group)
    selectedGroup.value = group
    localStorage.setItem('selected_group', group.id.toString())
  }

  const setGroups = (data: Group[]) => {
    groups.value = data

    const selected_group = localStorage.getItem('selected_group')
    if (selected_group) {
      const group = groups.value.find((g) => g.id === parseInt(selected_group))
      if (group) {
        selectGroup(group)
      }
    }
  }

  const addGroup = (group: Group) => {
    groups.value.push(group)
  }

  return { groups, selectedGroup, setGroups, addGroup, selectGroup }
})
