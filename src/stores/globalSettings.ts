import { ref, type Ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { readRoles, readSingleton } from '@directus/sdk'
import { useUser } from '@/stores/user'
import { prerenderedSettings } from '@/lib/prerendered-data'

export const useGlobalSettings = defineStore('globalSettings', () => {
  // Seed from build-time data so pre-rendered pages have the correct values;
  // fetchGlobalSetting() refreshes from the live backend on the client.
  const displayLegal: Ref<boolean> = ref(prerenderedSettings.displayLegal ?? false)
  const showBuyMeACoffee: Ref<boolean> = ref(prerenderedSettings.showBuyMeACoffee ?? true)
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
