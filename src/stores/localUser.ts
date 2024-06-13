import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LocalUserData } from '@/types'

export const useLocalUser = defineStore('localUser', () => {
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

  const addCreatedBooking = (secret_edit_key: string) => {
    if (!localUserData.value) {
      localUserData.value = {}
    }
    if (!localUserData.value.created_bookings) {
      localUserData.value.created_bookings = []
    }
    localUserData.value.created_bookings.push(secret_edit_key)
    storeLocalUserData()
  }

  const getCreatedBookings = () => {
    if (!localUserData.value) {
      getLocalUserData()
    }
    return localUserData.value?.created_bookings
  }

  const userHasCreatedBooking = (secret_edit_key: string) => {
    if (!localUserData.value) {
      getLocalUserData()
    }
    return localUserData.value?.created_bookings?.includes(secret_edit_key)
  }

  return {
    getSelectedGroup,
    setSelectedGroup,
    storeLocalUserData,
    getLocalUserData,
    addCreatedBooking,
    getCreatedBookings,
    userHasCreatedBooking
  }
})
