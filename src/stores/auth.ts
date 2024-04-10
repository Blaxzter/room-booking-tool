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
  const _keep_logged_in = ref(localStorage.getItem('keep_logged_in') === 'true')
  const auth_data = ref({} as AuthenticationData)

  const storage = {
    set(value: AuthenticationData) {
      if (!_keep_logged_in.value) {
        console.log('set auth_data', value)
        auth_data.value = value
        auth_data.value.expires_at = new Date().getTime() + (value.expires || 0)
        return
      } else {
        localStorage.setItem('access_token', value.access_token || '')
        localStorage.setItem('refresh_token', value.refresh_token || '')
        localStorage.setItem('expires', value.expires?.toString() || '')
        localStorage.setItem(
          'expires_at',
          (new Date().getTime() + (value.expires || 0))?.toString() || ''
        )
      }
    },
    get(key: string | undefined): AuthenticationData | string | number | null {
      if (key === undefined) {
        if (!_keep_logged_in.value) {
          console.log('get auth_data', auth_data.value)
          return auth_data.value
        }
        // get all
        return {
          access_token: localStorage.getItem('access_token') || '',
          refresh_token: localStorage.getItem('refresh_token') || '',
          expires: Number(localStorage.getItem('expires')),
          expires_at: Number(localStorage.getItem('expires_at'))
        }
      }

      if (!_keep_logged_in.value) {
        const keys: (keyof AuthenticationData)[] = [
          'access_token',
          'refresh_token',
          'expires',
          'expires_at'
        ]
        if (keys.includes(key as keyof AuthenticationData)) {
          return auth_data.value[key as keyof AuthenticationData] // TypeScript knows key is valid
        }
        return null
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

  const login = async ({
    email,
    password,
    keep_logged_in
  }: {
    email: string
    password: string
    keep_logged_in: boolean
  }) => {
    _keep_logged_in.value = keep_logged_in
    localStorage.setItem('keep_logged_in', keep_logged_in ? 'true' : 'false')
    await client
      .login(email, password)
      .then(() => {
        authenticated.value = true
      })
      .catch((error) => {
        console.error(error)
        const message = error?.errors?.length > 0 ? error.errors[0].detail : 'An error occurred'
        throw new Error(message)
      })
  }

  const checkAuth = async () => {
    const access_token = storage.get('access_token')
    const expires_at = Number(storage.get('expires_at'))

    // Check if access token exists and if the expires_at time is within the next 5 minutes
    const currentTime = new Date().getTime()

    // Check if access token exists and expires_at is more than 5 minutes from now
    if (access_token && expires_at && currentTime < expires_at - 5 * 60 * 1000) {
      // Access token exists and doesn't expire in the next 5 minutes
      authenticated.value = true
      return true
    } else {
      // Access token exist, has expired, or expires in less than 5 minutes
      if (access_token && currentTime > expires_at - 5 * 60 * 1000) {
        try {
          console.log('Refreshing token')
          await client.refresh()
          console.log('Token refreshed')
          authenticated.value = true
          return true
        } catch (error) {
          console.error(error)
          authenticated.value = false
          return false
        }
      } else {
        // No access token
        authenticated.value = false
        return false
      }
    }
  }

  const logout = () => {
    client
      .logout()
      .catch(console.error)
      .finally(() => {
        authenticated.value = false
        router.push({ name: 'login' })
      })
  }

  return { client, login, logout, checkAuth, isAuthenticated }
})
