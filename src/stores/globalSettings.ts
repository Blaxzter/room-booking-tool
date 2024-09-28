import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { readSingleton, readRoles } from '@directus/sdk'
import { useUser } from '@/stores/user'

export const useGlobalSettings = defineStore('globalSettings', () => {
  const displayLegal: Ref<boolean> = ref(false)
  const roleIdToName: Ref<{ [key: string]: string }> = ref({})

  const fetchGlobalSetting = async () => {
    const { noAuthClient } = useUser()
    await noAuthClient.request(readSingleton('settings')).then((res) => {
      displayLegal.value = res.display_legal
    })
  }

  const fetchRoles = async () => {
    const { client } = useUser()
    const roles = await client.request(
      readRoles({
        fields: ['*']
      })
    )
    console.log(roles)
    roleIdToName.value = roles.reduce((acc, role) => {
      acc[role.id] = role.name
      return acc
    })
  }

  return {
    displayLegal,
    fetchGlobalSetting,
    fetchRoles
  }
})
