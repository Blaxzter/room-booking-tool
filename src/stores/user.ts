import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LocalUserData } from '@/types'

export const useUser = defineStore('user', () => {
  const localUserData = ref<LocalUserData | null>(null)

  const getLocalUserData = () => {
    const localUserDataString = localStorage.getItem('user_data')
    if (!localUserDataString) {
      return localUserData
    }
    localUserData.value = JSON.parse(localUserDataString) as LocalUserData
    return localUserData
  }

  const storeLocalUserData = () => {
    localStorage.setItem('user_data', JSON.stringify(localUserData.value))
  }

  const setSelectedGroup = (group_id: string) => {
    if (!localUserData.value) {
      localUserData.value = {}
    }
    localUserData.value.selected_group = group_id
    storeLocalUserData()
  }

  const getSelectedGroup = () => {
    if (!localUserData.value) {
      getLocalUserData()
    }
    return localUserData.value?.selected_group
  }

  return { getSelectedGroup, setSelectedGroup, storeLocalUserData, getLocalUserData }
})
