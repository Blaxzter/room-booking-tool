import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobal = defineStore('global', () => {
  const searchString: Ref<string> = ref('')

  const reset = () => {
    searchString.value = ''
  }

  const setSearchString = (newSearchString: string): void => {
    searchString.value = newSearchString
  }

  const getSearchString = (): string => {
    return searchString.value
  }

  return {
    searchString,
    setSearchString,
    getSearchString,
    reset
  }
})
