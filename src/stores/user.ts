import { computed, ref, h } from 'vue'
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
  type DirectusUser,
  graphql,
  type GraphqlClient,
  type Query,
  readMe,
  rest,
  type RestClient,
  updateUser,
  registerUser,
  deleteUser,
  registerUserVerify,
  deleteFile
} from '@directus/sdk'
import type { CreateUserRequest, Group, MySchema, UpdateUserRequest, User } from '@/types'
import router from '@/router'
import { useRequests } from '@/stores/requests'
import { useNotificationSetting } from '@/stores/notificationSettings'
import { useLocalUser } from '@/stores/localUser'
import { useInitialDataStore } from '@/stores/initial'
import { useGlobal } from '@/stores/global'
import { useGroups } from '@/stores/groups'
import { useBookings } from '@/stores/booking'
import { useBookableObjects } from '@/stores/bookableObjects'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/toast'

export type MyDirectusClient = DirectusClient<MySchema> &
  AuthenticationClient<MySchema> &
  RestClient<MySchema> &
  GraphqlClient<MySchema>

export const useUser = defineStore('user', () => {
  const authenticated = ref(false)

  const _keep_logged_in = ref(localStorage.getItem('keep_logged_in') === 'true')
  const auth_data = ref({} as AuthenticationData)
  const user = ref<User>({} as any)

  const defaultRedirect: string = '/'
  const redirect = ref(defaultRedirect)

  const reset = () => {
    auth_data.value = {} as AuthenticationData
    user.value = {} as User
    redirect.value = defaultRedirect
    authenticated.value = false
  }

  const setRedirect = (path: string) => {
    // check if path is not login
    if (path === '/login') {
      return
    }
    redirect.value = path
  }

  const getRedirect = () => {
    return redirect.value
  }

  const storage = {
    set(value: AuthenticationData) {
      if (!_keep_logged_in.value) {
        auth_data.value = value
        auth_data.value.expires_at = new Date().getTime() + (value.expires || 0)
        return
      } else {
        localStorage.setItem('access_token', value.access_token || '')
        localStorage.setItem('refresh_token', value.refresh_token || '')
        localStorage.setItem('expires', value.expires?.toString() || '')
        localStorage.setItem('expires_at', (new Date().getTime() + (value.expires || 0))?.toString() || '')
      }
    },
    get(key: string | undefined): AuthenticationData | string | number | null {
      if (key === undefined) {
        if (!_keep_logged_in.value) {
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
        const keys: (keyof AuthenticationData)[] = ['access_token', 'refresh_token', 'expires', 'expires_at']
        if (keys.includes(key as keyof AuthenticationData)) {
          return auth_data.value[key as keyof AuthenticationData] // TypeScript knows key is valid
        }
        return null
      }
      return localStorage.getItem(key)
    }
  }

  const typedStorage: AuthenticationStorage = storage as unknown as AuthenticationStorage

  // current window.location.host but with api. prefix instead of www.
  const backendUrl = import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL
    : `https://api.${window.location.host}`
  const authMode: AuthenticationMode = 'json'
  const authConfig: AuthenticationConfig = {
    autoRefresh: true,
    msRefreshBeforeExpires: 10_000,
    storage: typedStorage
  }

  console.log(backendUrl)

  const client: MyDirectusClient = createDirectus<MySchema>(backendUrl)
    .with(authentication(authMode, authConfig))
    .with(rest())
    .with(graphql())

  const isAuthenticated = computed(() => {
    return authenticated.value
  })

  const getCurrentUserData = async () => {
    user.value = await client.request<User>(readMe())
    // write to local storage
    localStorage.setItem('user', JSON.stringify(user.value))
    if (user.value?.Invites && user.value.Invites.length > 0) {
      const { getInvites } = useGroups()
      await getInvites(user.value.id).then((invites) => {
        if (invites.length > 0) {
          invites.forEach((invite) => {
            if (invite.group_id) {
              toast({
                title: 'Invites',
                description: `You have been invited to join ${(invite.group_id as Group).name}`,
                variant: 'default',
                duration: 20000,
                action: h(
                  ToastAction,
                  {
                    altText: 'View',
                    onClick: () => {
                      router.push({ name: 'groups' })
                    }
                  },
                  {
                    default: () => 'View'
                  }
                )
              })
            }
          })
        }
      })
    }

    return user.value
  }

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
      .then(async () => {
        authenticated.value = true
      })
      .catch((error) => {
        throw new Error(error?.errors?.length > 0 ? error.errors[0].message : 'An error occurred')
      })

    await getCurrentUserData()
  }

  const checkAuth = async () => {
    const access_token = storage.get('access_token')
    const expires_at = Number(storage.get('expires_at'))

    // Check if access token exists and if the expires_at time is within the next 5 minutes
    const currentTime = new Date().getTime()

    // Check if access token exists and expires_at is more than 5 minutes from now
    if (access_token && expires_at && currentTime < expires_at - 5 * 60 * 1000) {
      user.value = JSON.parse(localStorage.getItem('user') || '{}')
      // Access token exists and doesn't expire in the next 5 minutes
      authenticated.value = true
      auth_data.value = {
        access_token: access_token as string,
        refresh_token: storage.get('refresh_token') as string,
        expires: storage.get('expires') as number,
        expires_at: expires_at
      }
      await getCurrentUserData()
      return true
    } else {
      // Access token exist, has expired, or expires in less than 5 minutes
      if (access_token && currentTime > expires_at - 5 * 60 * 1000) {
        try {
          await client.refresh()
          await getCurrentUserData()
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

  const resetState = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    const stores = [
      useRequests,
      useNotificationSetting,
      useLocalUser,
      useInitialDataStore,
      useGlobal,
      useGroups,
      useBookings,
      useBookableObjects
    ]

    stores.forEach((store) => {
      const { reset } = store()
      reset()
    })

    reset()
    authenticated.value = false
  }

  const logout = async () => {
    await client
      .logout()
      .catch(console.error)
      .finally(async () => {
        resetState()
        router.push({ name: 'login' })
      })
  }

  const updateUserData = async (data: UpdateUserRequest) => {
    const result = (await client.request(
      updateUser<UpdateUserRequest, Query<UpdateUserRequest, DirectusUser<User>>>(user.value.id, data)
    )) as DirectusUser<User>
    localStorage.setItem('user', JSON.stringify(result))
    user.value = result as unknown as User
  }

  const createUserRequest = async (data: CreateUserRequest) => {
    const registerClient = createDirectus(backendUrl).with(rest())
    await registerClient.request(
      registerUser(data.email, data.password, {
        first_name: data.first_name,
        last_name: data.last_name,
        verification_url: `https://${window.location.host}/verify-email`
      })
    )
  }

  const deleteUserRequest = async () => {
    await client.request(deleteUser(user.value.id)).then(() => {
      resetState()
      toast({
        title: 'User deleted',
        variant: 'destructive',
        description: 'Your account has been deleted.'
      })
      router.push({ name: 'login' })
    })
  }

  const addTelegramId = async (telegram_user_id: string | null, telegram_user_name: string | null) => {
    await client.request(updateUser(user.value.id, { telegram_user_id, telegram_user_name })).then(
      (result) => {
        user.value = result as unknown as User
        localStorage.setItem('user', JSON.stringify(result))
      },
      (error) => {
        console.error(error)
      }
    )
  }

  const verifyEmail = async (emailed_token: string) => {
    const noAuthClient = createDirectus(backendUrl).with(rest())

    await noAuthClient.request(registerUserVerify(emailed_token))
  }

  const deleteDirectusFile = async (file_id: string) => {
    const { client } = useUser()
    return await client.request(deleteFile(file_id))
  }

  const userName = computed(() => user.value?.first_name + ' ' + user.value?.last_name)
  const email = computed(() => user.value?.email)
  const hasName = computed(() => userName.value.trim() !== '')
  const name = computed(() => (hasName.value ? userName.value : email.value))
  const avatar = computed(() => `${backendUrl}/assets/${user.value?.avatar}` ?? '')
  const avatarId = computed(() => user.value?.avatar ?? '')
  const avatarFallback = computed(() => user.value?.first_name?.charAt(0) + user.value?.last_name?.charAt(0))

  return {
    client,
    user,
    auth_data,
    login,
    logout,
    checkAuth,
    isAuthenticated,
    setRedirect,
    getRedirect,
    updateUserData,
    createUserRequest,
    deleteUserRequest,
    verifyEmail,
    userName,
    email,
    hasName,
    name,
    avatar,
    avatarId,
    avatarFallback,
    reset,
    deleteDirectusFile,
    addTelegramId
  }
})
