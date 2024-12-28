import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { BookableObject, CreateBookableObjectRequest } from '@/types'
import { useUser } from '@/stores/user'
import { type BookableObjectsRequest } from '@/assets/ts/queries/initial_data'
import { useToast } from '@/components/ui/toast'
import { createItem, deleteItem, updateItem } from '@directus/sdk'
import { useGroups } from '@/stores/groups'
import _ from 'lodash'
import {
  type BookableObjectRequest,
  getBookableObjectByGroup,
  qGetBookableObjectById,
  userBookableObject
} from '@/assets/ts/queries/bookable_objects'

export const useBookableObjects = defineStore('bookableObjects', () => {
  const { client } = useUser()
  const { user } = storeToRefs(useUser())
  const { toast } = useToast()
  const { selectedGroupId } = storeToRefs(useGroups())

  const loading = ref(false)

  const selectedBookableObject = ref<BookableObject | null>(null)
  const bookableObjects = ref<BookableObject[]>([])

  const groupBookableObjects = ref<{ [key: string]: BookableObject[] }>({})

  const reset = () => {
    bookableObjects.value = []
    selectedBookableObject.value = null
    groupBookableObjects.value = {}
    loading.value = false
  }

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
        // check if bookable object is in selected group
        if (groupBookableObjects.value[`${group_association}`].includes(bookableObject)) {
          return
        }
        groupBookableObjects.value[`${group_association}`].push(bookableObject)
        if (selectedGroupId && `${group_association}` === selectedGroupId.value) {
          bookableObjects.value.push(bookableObject)
        }
      }
    }

    if (!groupBookableObjects.value['-1']) {
      groupBookableObjects.value['-1'] = []
    }
    if (groupBookableObjects.value['-1'].includes(bookableObject)) {
      return
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
        .query<BookableObjectsRequest>(getBookableObjectByGroup(group_id))
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
        .query<BookableObjectsRequest>(userBookableObject(user.value.id))
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
    bookableObject.owner = { id: user.value.id }
    if (!bookableObject.group || bookableObject.group?.length === 0) {
      bookableObject.group = []
    }
    bookableObject.status = 'published'
    let result;
    try {
      result = await client.request(createItem('bookable_object', bookableObject))
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error creating bookable object',
        description: error?.errors?.[0]?.message,
        variant: 'destructive'
      })
      throw error
    }

    // check if result.image is string and replace with { id: string } (yes it can be string)
    if (result.image && typeof result.image === 'string') {
      result.image = { id: result.image }
    }
    if (bookableObject.group.length > 0) {
      const { addBookableObjectToGroup } = useGroups()
      addBookableObjectToGroup(bookableObject.group[0]?.group_id.id, result)
    }
    // cast result to BookableObject
    addBookableObject(result as BookableObject)
    return result
  }

  const allLoadedBookableObjects = computed(() => {
    // merge all bookable objects from groups and current visible -> unique by id with lodash
    return _.uniqBy(_.flatten(_.values(groupBookableObjects.value)), 'id')
  })

  const getBookableObjectById = async ({
    id,
    isUniqueId = false,
    select = false
  }: {
    id: string
    isUniqueId?: boolean
    select?: boolean
  }): Promise<BookableObject | void> => {
    const localBookableObject = allLoadedBookableObjects.value.find((bookableObject) => bookableObject.id === id)

    if (!localBookableObject) {
      loading.value = true
      return await client
        .query<BookableObjectRequest>(qGetBookableObjectById({ id: id, isUniqueId: isUniqueId }))
        .then((res) => {
          loading.value = false
          if (res.bookable_object.length === 0) {
            return
          }
          if (select) {
            selectBookableObject(res.bookable_object[0])
          }
          addBookableObject(res.bookable_object[0])
          return res.bookable_object[0]
        })
        .catch((error) => {
          loading.value = false
          toast({
            title: 'Error',
            description: error.message
          })
        })
    }
    return localBookableObject
  }

  const deleteBookableObject = async (id: string) => {
    // delete bookable object from server
    await client.request(deleteItem('bookable_object', id)).then(() => {
      bookableObjects.value = bookableObjects.value.filter((obj) => obj.id !== id)
    })
  }

  const updateBookableObject = async (bookable_object_id: string, data: Partial<BookableObject>) => {
    const { client } = useUser()
    // Do not send update to backend if data is avatar: { id: undefined }
    if (!(Object.keys(data).length === 1 && Object.keys(data)[0] === 'image' && data.image?.id === undefined)) {
      await client.request(updateItem('bookable_object', bookable_object_id, data))
    }

    if (selectedBookableObject.value?.id === bookable_object_id) {
      Object.assign(selectedBookableObject.value, data)
    }

    const bookable_object = bookableObjects.value.find((g) => g.id === bookable_object_id)
    if (bookable_object) {
      Object.assign(bookable_object, data)
    }
    return bookable_object
  }

  const deleteImage = async (bookableObject: BookableObject) => {
    if (!bookableObject.image) {
      return
    }

    const { deleteDirectusFile, client } = useUser()
    return await client.request(updateItem('bookable_object', bookableObject.id, { image: null })).then(async () => {
      await deleteDirectusFile(bookableObject.image!.id)
    })
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
    createBookableObject,
    getBookableObjectById,
    deleteBookableObject,
    deleteImage,
    reset,
    updateBookableObject
  }
})
