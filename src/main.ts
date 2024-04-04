import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueAuthenticate, { type AuthenticateOptions } from 'vue-authenticate-2'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const authenticationOption: AuthenticateOptions = {
  baseUrl: 'http://localhost:8055',
  axios: axios.create({}),
  providers: {}
};

app.use(VueAuthenticate, authenticationOption);
app.provide('$auth', app.config.globalProperties.$auth);

app.use(createPinia())
app.use(router)

app.mount('#app')
