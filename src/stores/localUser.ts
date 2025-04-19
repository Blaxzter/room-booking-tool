import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { LocalUserData } from '@/types'
import { useUser } from './user'

export const useLocalUser = defineStore('localUser', () => {
  const localUserData = ref<LocalUserData | null>(null)
  const { user } = storeToRefs(useUser())

  const reset = () => {
    localUserData.value = null
  }

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

  const addCreatedBooking = (id: string, secret_edit_key: string, event_date: string, public_booking_id: string) => {
    if (!localUserData.value) {
      localUserData.value = {}
    }
    if (!localUserData.value.created_bookings) {
      localUserData.value.created_bookings = {}
    }
    // if the user.value.id is none (e.g. a shared booking view) then create a temporary user id and store it in the local storage
    if (!user.value.id) {
      // try to get the temp user id from the local storage 
      let tempUserId = localStorage.getItem('temp_user_id')
      if (!tempUserId) {
        // if no temp user id is found, create a new one
        tempUserId = 'temp_' + Math.random().toString(36).substring(2, 15)
        localStorage.setItem('temp_user_id', tempUserId)
      }
      
      localUserData.value.created_bookings[tempUserId] = {}
      localUserData.value.created_bookings[tempUserId][id] = { secret_edit_key, event_date, public_booking_id }
      storeLocalUserData()
      return
    }

    if (!localUserData.value.created_bookings[user.value.id]) {
      localUserData.value.created_bookings[user.value.id] = {}
    }

    localUserData.value.created_bookings[user.value.id][id] = { secret_edit_key, event_date }
    storeLocalUserData()
  }

  const getCreatedBookings = () => {
    if (!localUserData.value) {
      getLocalUserData()
    }
    return localUserData.value?.created_bookings
  }

  const userHasCreatedBooking = (id: string) => {
    if (!localUserData.value) {
      getLocalUserData()
    }
    
    // If user is logged in, check their bookings
    if (user.value.id) {
      return localUserData.value?.created_bookings?.[user.value.id]?.[id] !== undefined
    }
    
    // If user not logged in, check for temp user ID
    const tempUserId = localStorage.getItem('temp_user_id')
    if (tempUserId) {
      return localUserData.value?.created_bookings?.[tempUserId]?.[id] !== undefined
    }
    
    return false
  }

  return {
    getSelectedGroup,
    setSelectedGroup,
    storeLocalUserData,
    getLocalUserData,
    addCreatedBooking,
    getCreatedBookings,
    userHasCreatedBooking,
    reset
  }
})
