import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Booking } from '@/types'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'
import { deleteItem, updateItem } from '@directus/sdk'
import { useBookings } from '@/stores/booking'
import { useI18n } from 'vue-i18n'

export const useRequests = defineStore('requests', () => {
  const { toast } = useToast()
  const { client } = useUser()
  const { user } = storeToRefs(useUser())
  const { t } = useI18n()

  const requestLoading = ref(false)

  const requests = ref<Booking[]>([])

  const reset = () => {
    requestLoading.value = false
    requests.value = []
  }

  const setRequests = (data: Booking[]) => {
    requests.value = data
  }

  const updateBookingApprovalState = async (request: Booking, confirmed: boolean) => {
    requestLoading.value = true
    await client
      .request(updateItem('booking', request.id, { confirmed: confirmed, confirmed_by: user.value.id }))
      .then(() => {
        if (confirmed) {
          toast({ variant: 'success', title: t('requests.actions.approved', 'Request approved') })
        } else {
          toast({ variant: 'destructive', title: t('requests.actions.revoked', 'Request revoked') })
        }
        request.confirmed = confirmed
        request.confirmed_by = user.value
        requests.value = requests.value.filter((r) => r.id !== request.id)
      })
      .catch((error) => {
        console.error(error)
        if (error?.errors?.length > 0) {
          const serverError = error.errors[0];
          if (serverError.message === 'NOT_AUTHORIZED_ROLE_MISMATCH') {
            toast({ variant: 'destructive', title: t('requests.actions.unauthorized', 'You are not authorized to update this booking') })
          }
          else {
            toast({ variant: 'destructive', title: t('requests.actions.error', 'An error occured when updating the booking state') })
          }
        }
        throw error
      }).finally(() => {
        requestLoading.value = false
      })
  }

  const rejectRequest = async (request: Booking, deleted: boolean = false) => {
    requestLoading.value = true
    await client.request(deleteItem('booking', request.id)).then(() => {
      toast({ 
        variant: deleted ? 'success' : 'destructive', 
        title: deleted 
          ? t('requests.actions.removed', 'Request removed') 
          : t('requests.actions.rejected', 'Request rejected') 
      })
      requests.value = requests.value.filter((r) => r.id !== request.id)
      const { removeBookingById } = useBookings()
      removeBookingById(request.id)
    }).catch((error) => {
      console.error(error)
      toast({ variant: 'destructive', title: t('requests.actions.reject_error', 'An error occured when removing the request') })
      throw error
    }).finally(() => {
      requestLoading.value = false
    })
  }

  return { requestLoading, requests, setRequests, updateBookingApprovalState, rejectRequest, reset }
})
