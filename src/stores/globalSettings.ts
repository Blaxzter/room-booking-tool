import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { readSingleton } from '@directus/sdk'
import { useUser } from '@/stores/user'

export const useGlobalSettings = defineStore('globalSettings', () => {
  const displayLegal: Ref<boolean> = ref(false)

  const fetchGlobalSetting = async () => {
    const { noAuthClient } = useUser()
    await noAuthClient.request(readSingleton('settings')).then((res) => {
      displayLegal.value = res.display_legal
    })
  }

  return {
    displayLegal,
    fetchGlobalSetting
  }
})
