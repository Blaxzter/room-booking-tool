import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Booking } from '@/types'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'
import { useBookableObjects } from '@/stores/bookableObjects'
import { createItem } from '@directus/sdk'

export const useRequests = defineStore('requests', () => {
  const { toast } = useToast()
  const { client } = useUser()

  const loading = ref(false)

  const requests = ref<Booking[]>([])

  const setRequests = (data: Booking[]) => {
    requests.value = data
  }

  return { requests, setRequests }
})
