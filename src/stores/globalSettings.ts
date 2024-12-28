import { ref, type Ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { readRoles, readSingleton } from '@directus/sdk'
import { useUser } from '@/stores/user'

export const useGlobalSettings = defineStore('globalSettings', () => {
  const displayLegal: Ref<boolean> = ref(false)
  const demoUser: Ref<boolean> = ref(false)

  const demoDialogOpen = ref(true)

  const { isAuthenticated } = storeToRefs(useUser())

  const fetchGlobalSetting = async () => {
    const { noAuthClient } = useUser()
    await noAuthClient.request(readSingleton('settings')).then((res) => {
      displayLegal.value = res.display_legal
    })
  }

  watch([isAuthenticated], async () => {
    if (isAuthenticated.value) {
      const { getDemoUserRole } = useGlobalSettings()
      await getDemoUserRole()
    }
  })

  const getDemoUserRole = async () => {
    const { client, user } = useUser()

    // Permissions in backend are set so only demo role is returned
    const demoRole = await client.request(
      readRoles({
        fields: ['*']
      })
    )

    demoUser.value = user.role === demoRole[0]
    return demoUser.value
  }

  const isDemoUser = computed(() => {
    return demoUser.value
  })

  return {
    displayLegal,
    fetchGlobalSetting,
    demoDialogOpen,
    getDemoUserRole,
    isDemoUser
  }
})
