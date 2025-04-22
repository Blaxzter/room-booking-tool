import { computed, h, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  authentication,
  type AuthenticationClient,
  type AuthenticationConfig,
  type AuthenticationData,
  type AuthenticationMode,
  type AuthenticationStorage,
  createDirectus,
  deleteFile,
  deleteUser,
  type DirectusClient,
  type DirectusUser,
  graphql,
  type GraphqlClient,
  type Query,
  readMe,
  registerUser,
  registerUserVerify,
  rest,
  type RestClient,
  updateUser
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
import { toast, ToastAction } from '@/components/ui/toast'
import { useI18n } from 'vue-i18n'

export type MyDirectusClient = DirectusClient<MySchema> &
  AuthenticationClient<MySchema> &
  RestClient<MySchema> &
  GraphqlClient<MySchema>

export type NoAuthDirectusClient = DirectusClient<MySchema> & RestClient<MySchema> & GraphqlClient<MySchema>

export class AuthError extends Error {
  code?: string;
  originalError?: any;

  constructor(message: string, code?: string, originalError?: any) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.originalError = originalError;
  }
}

export const useUser = defineStore('user', () => {
  const authenticated = ref(false)
  const { locale } = useI18n()

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
  const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055'
    : `${window.location.origin}/api`

  const authMode: AuthenticationMode = 'json'
  const authConfig: AuthenticationConfig = {
    autoRefresh: true,
    msRefreshBeforeExpires: 10_000,
    storage: typedStorage
  }

  const client: MyDirectusClient = createDirectus<MySchema>(backendUrl)
    .with(authentication(authMode, authConfig))
    .with(rest())
    .with(graphql())

  const noAuthClient: NoAuthDirectusClient = createDirectus<MySchema>(backendUrl).with(rest()).with(graphql())

  const isAuthenticated = computed(() => {
    return authenticated.value
  })

  const getCurrentUserData = async () => {
    user.value = await client.request<User>(readMe())

    // use i18n to set the language
    if (user.value.language) {
      locale.value = user.value.language
    }

    // write to local storage
    localStorage.setItem('user', JSON.stringify(user.value))

    // check if user has invites
    setTimeout(async () => {
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
    }, 2000)

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
        if (error?.errors?.length > 0) {
          const serverError = error.errors[0];
          const errorCode = serverError.extensions?.code;
          
          throw new AuthError(
            serverError.message, 
            errorCode, 
            error
          );
        } else {
          throw new AuthError('An error occurred');
        }
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
      auth_data.value = {
        access_token: access_token as string,
        refresh_token: storage.get('refresh_token') as string,
        expires: storage.get('expires') as number,
        expires_at: expires_at
      }
      await getCurrentUserData()
      authenticated.value = true
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
    const lang = locale.value
    await registerClient.request(
      registerUser(data.email, data.password, {
        first_name: JSON.stringify({first: data.first_name, last: data.last_name}),
        last_name: lang,
        verification_url: `${window.location.protocol}//${window.location.host}/verify-email`
      })
    )

    // await axios.post(`${backendUrl}/users/register`, {
    //   email: `${data.email}@de-DE`,
    //   password: data.password,
    //   first_name: data.first_name,
    //   last_name: data.last_name,
    //   verification_url: `${window.location.protocol}//${window.location.host}/verify-email`
    // })
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await client.request(updateUser(user.value.id, { telegram_user_id, telegram_user_name })).then( // @ts-nocheck
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
  const avatar = computed(() => `${backendUrl}/assets/${user.value?.avatar}`)
  const avatarId = computed(() => user.value?.avatar ?? '')
  const avatarFallback = computed(() => {
    if (user.value?.first_name && user.value?.last_name) {
      return user.value?.first_name?.charAt(0) + user.value?.last_name?.charAt(0)
    }
    if (user.value?.first_name) {
      return user.value.first_name.substring(0, 2).toUpperCase()
    }
    if (user.value?.email) {
      return user.value.email.substring(0, 2).toUpperCase()
    }
    return 'US'
  })

  return {
    client,
    noAuthClient,
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
