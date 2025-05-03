import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'
import App from './App.vue'
import router from './router'

// Import your message files
import enUS from './locales/en-US.json'
import deDE from './locales/de-DE.json' // Add languages as needed

polyfillCountryFlagEmojis()

dayjs.extend(weekOfYear)
dayjs.extend(isToday)

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

const i18n = createI18n<[MessageSchema], 'en-US' | 'de-DE'>({
  locale: getPreferredLanguage(),
  messages: {
    'en-US': enUS,
    'de-DE': deDE
  }
})


const app = createApp(App)

app.provide('dayjs', dayjs)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
