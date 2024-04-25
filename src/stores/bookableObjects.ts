import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookableObject, Group } from '@/types'
import { useAuth } from '@/stores/auth'
import { getBookableObjectByGroup } from '@/assets/ts/gql_queries'
import { useToast } from '@/components/ui/toast'

export const useBookableObjects = defineStore('bookableObjects', () => {
  const { client } = useAuth()
  const { toast } = useToast()

  const loading = ref(false)

  const selectedBookableObject = ref<BookableObject | null>(null)
  const bookableObjects = ref<BookableObject[]>([])
  // keep group bookable objects as key value pair
  const groupBookableObjects = ref<{ [key: string]: BookableObject[] }>({})

  const selectBookableObject = (bookableObject: BookableObject) => {
    selectedBookableObject.value = bookableObject
  }

  const setBookableObjects = (data: BookableObject[]) => {
    bookableObjects.value = data
  }

  const addBookableObject = (bookableObject: BookableObject) => {
    bookableObjects.value.push(bookableObject)
  }

  const fetchBookableObjects = async (group_id: number | string) => {
    // Fetch bookable objects from the server
    loading.value = true
    await client
      .query<BookableObject[]>(getBookableObjectByGroup(group_id))
      .then((res) => {
        groupBookableObjects.value[group_id] = res
        loading.value = false
        return res
      })
      .catch((error) => {
        loading.value = false
        toast({
          title: 'Error',
          description: error.message
        })
      })

    return bookableObjects
  }

  const getBookableObjectByGroupId = async (
    group_id: number | string
  ): Promise<BookableObject[]> => {
    if (!groupBookableObjects.value[group_id]) {
      await fetchBookableObjects(group_id).then((res) => {
        return res
      })
    }

    return groupBookableObjects.value[group_id]
  }

  return {
    bookableObjects,
    selectedBookableObject,
    loading,
    setBookableObjects,
    addBookableObject,
    selectBookableObject,
    getBookableObjectByGroupId
  }
})
