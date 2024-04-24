import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookableObject, Group } from '@/types'

export const useBookableObjects = defineStore('bookableObjects', () => {
  const selectedBookableObject = ref<BookableObject | null>(null)
  const bookableObjects = ref<BookableObject[]>([])

  const selectBookableObject = (bookableObject: BookableObject) => {
    selectedBookableObject.value = bookableObject
  }

  const setBookableObjects = (data: BookableObject[]) => {
    bookableObjects.value = data
  }

  const addBookableObject = (bookableObject: BookableObject) => {
    bookableObjects.value.push(bookableObject)
  }

  return {
    bookableObjects,
    selectedBookableObject,
    setBookableObjects,
    addBookableObject,
    selectBookableObject
  }
})
