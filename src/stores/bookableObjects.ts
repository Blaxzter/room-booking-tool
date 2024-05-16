import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { BookableObject, CreateBookableObjectRequest } from '@/types'
import { useAuth } from '@/stores/auth'
import { getBookableObjectByGroup, type BookableObjectRequest, userBookableObject } from '@/assets/ts/gql_queries'
import { useToast } from '@/components/ui/toast'
import { createItem } from '@directus/sdk'
import { useGroups } from '@/stores/groups'
import _ from 'lodash'

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
    bookableObjects.value = data
    if (groupId) {
      groupBookableObjects.value[groupId] = data
    }
  }

  const addBookableObject = (bookableObject: BookableObject) => {
    if (!_.isNil(bookableObject?.group) && bookableObject?.group.length > 0) {
      for (const group_association of bookableObject.group) {
        if (!groupBookableObjects.value[`${group_association}`]) {
          groupBookableObjects.value[`${group_association}`] = []
        }
        groupBookableObjects.value[`${group_association}`].push(bookableObject)
        if (`${group_association}` === selectedGroupId.value) {
          bookableObjects.value.push(bookableObject)
        }
      }
    }

    if (!groupBookableObjects.value['-1']) {
      groupBookableObjects.value['-1'] = []
    }
    groupBookableObjects.value['-1'].push(bookableObject)
    if (_.isNil(selectedGroupId) || selectedGroupId.value === '-1') {
      bookableObjects.value.push(bookableObject)
    }
  }

  const fetchBookableObjectsByGroupId = async (group_id: string) => {
    // Fetch bookable objects from the server
    if (groupBookableObjects.value[group_id]) {
      bookableObjects.value = groupBookableObjects.value[group_id]
    } else {
      loading.value = true
      await client
        .query<BookableObjectRequest>(getBookableObjectByGroup(group_id))
        .then((res) => {
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
      await client
        .query<BookableObjectRequest>(userBookableObject(user.id))
        .then((res) => {
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
    if (!groupBookableObjects.value[group_id]) {
      return []
    }

    return groupBookableObjects.value[group_id]
  })

  const createBookableObject = async (bookableObject: CreateBookableObjectRequest) => {
    const { client } = useAuth()
    const { user } = storeToRefs(useAuth())

    bookableObject.owner = { id: user.value.id }
    if (!bookableObject.group || bookableObject.group?.length === 0) {
      bookableObject.group = []
    }
    bookableObject.status = 'published'
    const result = await client.request(createItem('bookable_object', bookableObject))
    console.log(result)
    // cast result to BookableObject
    addBookableObject(result as BookableObject)
    return result
  }

  return {
    bookableObjects,
    selectedBookableObject,
    loading,
    fetchBookableObjectsByGroupId,
    fetchUserBookableObjects,
    setBookableObjects,
    addBookableObject,
    selectBookableObject,
    getBookableObjectBySelectedGroup,
    createBookableObject
  }
})
