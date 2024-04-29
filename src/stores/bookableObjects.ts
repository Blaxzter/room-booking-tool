import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { BookableObject } from '@/types'
import { useAuth } from '@/stores/auth'
import { getBookableObjectByGroup, type BookableObjectRequest, userBookableObject } from '@/assets/ts/gql_queries'
import { useToast } from '@/components/ui/toast'

import { useGroups } from '@/stores/groups'

export const useBookableObjects = defineStore('bookableObjects', () => {
  const { client, user } = useAuth()
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
      bookableObjects.value = groupBookableObjects.value[group_id]
    } else {
      loading.value = true
      console.log('fetching bookable objects')
      await client
        .query<BookableObjectRequest>(getBookableObjectByGroup(group_id))
        .then((res) => {
          console.log('fetchBookableObjectsByGroupId', res.bookable_object)
          setBookableObjects({ data: res.bookable_object, groupId: group_id })
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
    }

    return bookableObjects
  }

  const fetchUserBookableObjects = async () => {
    // Fetch bookable objects from the server
    if (groupBookableObjects.value['-1']) {
      bookableObjects.value = groupBookableObjects.value['-1']
    } else {
      loading.value = true
      console.log('fetching bookable objects')
      await client
        .query<BookableObjectRequest>(userBookableObject(user.id))
        .then((res) => {
          console.log('fetchBookableObjectsByGroupId', res.bookable_object)
          setBookableObjects({ data: res.bookable_object, groupId: '-1' })
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
    }

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
    fetchUserBookableObjects,
    setBookableObjects,
    addBookableObject,
    selectBookableObject,
    getBookableObjectBySelectedGroup
  }
})
