import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'
import App from './App.vue'
import router from './router'

polyfillCountryFlagEmojis()

dayjs.extend(weekOfYear)
dayjs.extend(isToday)

const app = createApp(App)

app.provide('dayjs', dayjs)
app.provide(/* key */ 'message', /* value */ 'hello!')

app.use(createPinia())
app.use(router)

app.mount('#app')
