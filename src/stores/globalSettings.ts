import { ref, type Ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { readRoles, readSingleton } from '@directus/sdk'
import { useUser } from '@/stores/user'

export const useGlobalSettings = defineStore('globalSettings', () => {
  const displayLegal: Ref<boolean> = ref(false)
  const showBuyMeACoffee: Ref<boolean> = ref(true)
  const demoUser: Ref<boolean> = ref(false)

  const demoDialogOpen = ref(true)

  const { user } = storeToRefs(useUser())

  const fetchGlobalSetting = async () => {
    const { noAuthClient } = useUser()
    await noAuthClient.request(readSingleton('settings')).then((res) => {
      displayLegal.value = res.display_legal
      showBuyMeACoffee.value = res.show_buy_me_a_coffee
    })
  }


  watch(
    () => user.value,
    async (newValue, oldValue) => {
      if (newValue && Object.keys(oldValue).length === 0) {
        const { getDemoUserRole } = useGlobalSettings()
        await getDemoUserRole()
      }
    }
  )

  const getDemoUserRole = async () => {
    const { client, user } = useUser()

    // Permissions in backend are set so only demo role is returned
    const demoRole = await client.request(
      readRoles({
        fields: ['*']
      })
    ) as unknown[]

    demoUser.value = user.role === (demoRole[0] as string)
    return demoUser.value
  }

  const isDemoUser = computed(() => {
    return demoUser.value
  })

  return {
    displayLegal,
    showBuyMeACoffee,
    fetchGlobalSetting,
    demoDialogOpen,
    getDemoUserRole,
    isDemoUser
  }
})
