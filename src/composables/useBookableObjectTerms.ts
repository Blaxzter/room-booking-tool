import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export enum BookableObjectTermType {
  SINGULAR = 'singular',
  PLURAL = 'plural',
  LOWERCASE = 'lowercase'
}

/**
 * Composable for accessing internationalized bookable object terms
 */
export function useBookableObjectTerms() {
  const { t } = useI18n()
  
  /**
   * Get all translated bookable object terms of a specific type
   * @param type - The type of terms to retrieve (singular, plural, lowercase)
   * @returns An array of translated terms
   */
  const getBookableObjectTerms = (type: BookableObjectTermType = BookableObjectTermType.PLURAL) => {
    // Need to cast to unknown first since the t function returns a string by default
    return [
        t(`bookableObjects.types.${type}[0]`),
        t(`bookableObjects.types.${type}[1]`),
        t(`bookableObjects.types.${type}[2]`),
        t(`bookableObjects.types.${type}[3]`)
      ]
  }
  
  // Create computed properties for easy access to each type
  const singularTerms = computed(() => getBookableObjectTerms(BookableObjectTermType.SINGULAR))
  const pluralTerms = computed(() => getBookableObjectTerms(BookableObjectTermType.PLURAL))
  const lowercaseTerms = computed(() => getBookableObjectTerms(BookableObjectTermType.LOWERCASE))
  
  /**
   * Get a random term of the specified type
   * @param type - The type of term to retrieve (singular, plural, lowercase)
   * @returns A random translated term
   */
  const getRandomTerm = (type: BookableObjectTermType = BookableObjectTermType.PLURAL) => {
    const terms = getBookableObjectTerms(type)
    return terms[Math.floor(Math.random() * terms.length)]
  }
  
  /**
   * Get all translated bookable object items
   * @returns An array of translated bookable objects with name and description
   */
  const getBookableObjectList = () => {
    const count = 10 // Based on the constant file having 10 items
    const result = []
    
    for (let i = 0; i < count; i++) {
      result.push({
        name: t(`bookableObjects.examples[${i}].name`),
        description: t(`bookableObjects.examples[${i}].description`)
      })
    }
    
    return result
  }
  
  /**
   * Get a random bookable object with translated name and description
   * @returns A random translated bookable object
   */
  const getRandomBookableObject = () => {
    const list = getBookableObjectList()
    return list[Math.floor(Math.random() * list.length)]
  }
  
  return {
    getBookableObjectTerms,
    singularTerms,
    pluralTerms,
    lowercaseTerms,
    getRandomTerm,
    getBookableObjectList,
    getRandomBookableObject
  }
} 