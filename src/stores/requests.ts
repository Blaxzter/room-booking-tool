import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Booking } from '@/types'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'
import { deleteItem, updateItem } from '@directus/sdk'

export const useRequests = defineStore('requests', () => {
  const { toast } = useToast()
  const { client } = useUser()
  const { user } = storeToRefs(useUser())

  const requestLoading = ref(false)

  const requests = ref<Booking[]>([])

  const reset = () => {
    requestLoading.value = false
    requests.value = []
  }

  const setRequests = (data: Booking[]) => {
    requests.value = data
  }

  const approveRequest = async (request: Booking) => {
    console.log('Approving request', request)
    requestLoading.value = true
    await client
      .request(updateItem('booking', request.id, { confirmed: true, confirmed_by: user.value.id }))
      .then(() => {
        toast({ variant: 'success', title: 'Request approved' })
        request.confirmed = true
        request.confirmed_by = user.value
        requests.value = requests.value.filter((r) => r.id !== request.id)
      })
    requestLoading.value = false
  }

  const rejectRequest = async (request: Booking) => {
    requestLoading.value = true
    await client.request(deleteItem('booking', request.id)).then(() => {
      toast({ variant: 'destructive', title: 'Request rejected' })
      requests.value = requests.value.filter((r) => r.id !== request.id)
    })
    requestLoading.value = false
  }

  return { requestLoading, requests, setRequests, approveRequest, rejectRequest, reset }
})
