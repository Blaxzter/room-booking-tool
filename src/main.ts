import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide('dayjs', dayjs)

app.use(createPinia())
app.use(router)

app.mount('#app')
