import { defineStore } from 'pinia'
import { type AuthenticationClient, type DirectusClient, type RestClient } from '@directus/sdk'
import type { MySchema } from '@/types'

export type MyDirectusClient = DirectusClient<MySchema> &
  AuthenticationClient<MySchema> &
  RestClient<MySchema>

export const useAuth = defineStore('group', () => {
  return {}
})
