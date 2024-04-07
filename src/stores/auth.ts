import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  authentication,
  type AuthenticationClient,
  type AuthenticationConfig,
  type AuthenticationData,
  type AuthenticationMode,
  type AuthenticationStorage,
  createDirectus,
  type DirectusClient,
  rest,
  type RestClient
} from '@directus/sdk'
import type { MySchema } from '@/types'
import router from '@/router'

export type MyDirectusClient = DirectusClient<MySchema> &
  AuthenticationClient<MySchema> &
  RestClient<MySchema>

export const useAuth = defineStore('auth', () => {
  const storage = {
    set(value: AuthenticationData) {
      localStorage.setItem('access_token', value.access_token || '')
      localStorage.setItem('refresh_token', value.refresh_token || '')
      localStorage.setItem('expires', value.expires?.toString() || '')
      localStorage.setItem(
        'expires_at',
        (new Date().getTime() + (value.expires || 0))?.toString() || ''
      )
    },
    get(key: string | undefined): AuthenticationData | string | null {
      if (key === undefined) {
        // get all
        return {
          access_token: localStorage.getItem('access_token') || '',
          refresh_token: localStorage.getItem('refresh_token') || '',
          expires: Number(localStorage.getItem('expires')),
          expires_at: Number(localStorage.getItem('expires_at'))
        }
      }
      return localStorage.getItem(key)
    }
  }

  const typedStorage: AuthenticationStorage = storage as unknown as AuthenticationStorage

  const backendUrl = import.meta.env.VITE_BACKEND_URL as string
  const authMode: AuthenticationMode = 'json'
  const authConfig: AuthenticationConfig = {
    autoRefresh: true,
    msRefreshBeforeExpires: 10_000,
    storage: typedStorage
  }

  const client: MyDirectusClient = createDirectus<MySchema>(backendUrl)
    .with(authentication(authMode, authConfig))
    .with(rest())

  const authenticated = ref(false)
  const isAuthenticated = computed(() => {
    return authenticated.value
  })

  const login = async ({ email, password }: { email: string; password: string }) => {
    await client
      .login(email, password)
      .then(() => {
        authenticated.value = true
      })
      .catch((error) => {
        console.error(error)
        const message = error?.response?.data?.message || 'Failed to log in'
        throw new Error(message)
      })
  }

  const checkAuth = async () => {
    const access_token = storage.get('access_token')
    const expires_at = Number(storage.get('expires_at'))

    console.log('access_token', access_token)
    console.log(
      `current time: ${new Date().getTime() - 5 * 60 * 1000} < expires at ${expires_at - 5 * 60 * 1000} = ${new Date().getTime() < expires_at - 5 * 60 * 1000}`
    )

    // Check if access token exists and if the expires_at time is within the next 5 minutes
    const currentTime = new Date().getTime()

    // Check if access token exists and expires_at is more than 5 minutes from now
    if (access_token && expires_at && currentTime < expires_at - 5 * 60 * 1000) {
      // Access token exists and doesn't expire in the next 5 minutes
      authenticated.value = true
    } else {
      // Access token does not exist, has expired, or expires in less than 5 minutes
      if (currentTime > expires_at - 5 * 60 * 1000) {
        try {
          console.log('Refreshing token')
          await client.refresh()
          console.log('Token refreshed')
          authenticated.value = true
        } catch (error) {
          console.error(error)
          authenticated.value = false
        }
      }
    }
  }

  const logout = () => {
    client
      .logout()
      .catch(console.error)
      .finally(() => {
        // removeAuthData()
        router.push({ name: 'login' })
      })
  }

  return { client, login, logout, checkAuth, isAuthenticated }
})
