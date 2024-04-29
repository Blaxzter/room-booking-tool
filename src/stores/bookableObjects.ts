import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { BookableObject } from '@/types'
import { useAuth } from '@/stores/auth'
import { getBookableObjectByGroup } from '@/assets/ts/gql_queries'
import { useToast } from '@/components/ui/toast'

import { useGroups } from '@/stores/groups'

export const useBookableObjects = defineStore('bookableObjects', () => {
  const { client } = useAuth()
  const { toast } = useToast()
  const { selectedGroupId } = storeToRefs(useGroups())

  const loading = ref(false)

  const selectedBookableObject = ref<BookableObject | null>(null)
  const bookableObjects = ref<BookableObject[]>([])
  // keep group bookable objects as key value pair
  const groupBookableObjects = ref<{ [key: string]: BookableObject[] }>({})

  const selectBookableObject = (bookableObject: BookableObject) => {
    selectedBookableObject.value = bookableObject
  }

  const setBookableObjects = ({ data, groupId = null }: { data: BookableObject[]; groupId?: string | null }) => {
    console.log('setBookableObjects', data)
    bookableObjects.value = data
    if (groupId) {
      groupBookableObjects.value[groupId] = data
    }
  }

  const addBookableObject = (bookableObject: BookableObject) => {
    bookableObjects.value.push(bookableObject)
  }

  const fetchBookableObjectsByGroupId = async (group_id: string) => {
    // Fetch bookable objects from the server
    if (groupBookableObjects.value[group_id]) {
      return groupBookableObjects.value[group_id]
    }

    loading.value = true
    console.log('fetching bookable objects')
    await client
      .query<BookableObject[]>(getBookableObjectByGroup(group_id))
      .then((res) => {
        groupBookableObjects.value[group_id] = res
        loading.value = false
        setBookableObjects({ data: res, groupId: group_id })
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

  const getBookableObjectBySelectedGroup = computed(() => {
    if (!selectedGroupId?.value) {
      return []
    }

    const group_id = selectedGroupId.value
    console.log('group_id', group_id)
    if (!groupBookableObjects.value[group_id]) {
      return []
    }

    return groupBookableObjects.value[group_id]
  })

  return {
    bookableObjects,
    selectedBookableObject,
    loading,
    fetchBookableObjectsByGroupId,
    setBookableObjects,
    addBookableObject,
    selectBookableObject,
    getBookableObjectBySelectedGroup
  }
})
