import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'

polyfillCountryFlagEmojis()

dayjs.extend(weekOfYear)
dayjs.extend(isToday)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide('dayjs', dayjs)

app.use(createPinia())
app.use(router)

app.mount('#app')
