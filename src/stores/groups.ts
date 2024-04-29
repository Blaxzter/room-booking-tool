import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Group } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'

export const useGroups = defineStore('group', () => {
  const { setSelectedGroup, getSelectedGroup } = useUser()
  const { fetchBookableObjectsByGroupId, fetchUserBookableObjects } = useBookableObjects()

  const groups = ref<Group[]>([])
  const selectedGroupId = ref<string | null>(getSelectedGroup() || null)

  const selectGroup = async (group: Group) => {
    console.log('selecting group', group)
    setSelectedGroup(group.id)
    selectedGroupId.value = group.id
    if (group.id !== '-1') await fetchBookableObjectsByGroupId(group.id)
    else fetchUserBookableObjects()
  }

  const setGroups = async (data: Group[]) => {
    groups.value = data

    const selected_group = getSelectedGroup()
    if (selected_group) {
      const group = groups.value.find((g) => g.id === selected_group)
      if (group) {
        await selectGroup(group)
      }
    }
  }

  const addGroup = (group: Group) => {
    groups.value.push(group)
  }

  return { groups, selectedGroupId, setGroups, addGroup, selectGroup }
})
