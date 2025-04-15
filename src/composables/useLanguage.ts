import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'

export interface Language {
  code: string
  name: string
  flag: string
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' }
]

/**
 * Composable for managing application language
 */
export function useLanguage() {
  const { locale } = useI18n()
  const availableLanguages = ref(SUPPORTED_LANGUAGES)
  
  const currentLanguage = computed(() => {
    return availableLanguages.value.find(lang => lang.code === locale.value) || availableLanguages.value[0]
  })
  
  /**
   * Change the application language
   * @param langCode - The language code to switch to (e.g., 'en-US', 'de-DE')
   */
  const changeLanguage = (langCode: string) => {
    if (availableLanguages.value.some(lang => lang.code === langCode)) {
      locale.value = langCode
      // Optionally, save to localStorage to persist language choice
      localStorage.setItem('user-language', langCode)
    }
  }

  /**
   * Switch to the next language in the available languages list
   */
  const toggleLanguage = () => {
    const currentIndex = availableLanguages.value.findIndex(lang => lang.code === locale.value)
    const nextIndex = (currentIndex + 1) % availableLanguages.value.length
    changeLanguage(availableLanguages.value[nextIndex].code)
  }
  
  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    toggleLanguage
  }
} 