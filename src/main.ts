import './assets/main.scss'

import { createApp as createVueApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'
import App from './App.vue'
import router from './router'
import ClientOnly from './components/utils/ClientOnly.vue'

// Import your message files
import enUS from './locales/en-US.json'
import deDE from './locales/de-DE.json' // Add languages as needed

type MessageSchema = typeof enUS

// Get user's preferred language from localStorage or use browser language
const getPreferredLanguage = (): 'en-US' | 'de-DE' => {
  const savedLanguage = localStorage.getItem('user-language')
  if (savedLanguage && ['en-US', 'de-DE'].includes(savedLanguage)) {
    return savedLanguage as 'en-US' | 'de-DE'
  }
  
  // Fallback to browser language if available and supported
  const browserLang = navigator.language
  if (browserLang.startsWith('de')) {
    return 'de-DE'
  }
  
  // Default to English
  return 'en-US'
}

// Export a function to create the app (for both client and SSG)
export function createApp() {
  // Initialize plugins
  if (typeof window !== 'undefined') {
    polyfillCountryFlagEmojis()
  }
  
  dayjs.extend(weekOfYear)
  dayjs.extend(isToday)
  
  const i18n = createI18n<[MessageSchema], 'en-US' | 'de-DE'>({
    legacy: false,
    locale: typeof window !== 'undefined' ? getPreferredLanguage() : 'en-US',
    messages: {
      'en-US': enUS,
      'de-DE': deDE
    }
  })
  
  const pinia = createPinia()
  const app = createVueApp(App)
  
  app.provide('dayjs', dayjs)
  
  // Register ClientOnly component globally
  app.component('ClientOnly', ClientOnly)
  
  app.use(pinia)
  app.use(router)
  app.use(i18n)
  
  return { app, router, pinia }
}

// For traditional client-side rendering (non-SSG)
if (typeof window !== 'undefined' && !import.meta.env.SSR) {
  const { app } = createApp()
  app.mount('#app')
}
