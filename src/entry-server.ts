// src/entry-server.ts
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { createRouter } from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'
import deDE from './locales/de-DE.json'
import axios from 'axios'
import { useGlobalSettings } from './stores/globalSettings'

// Fetch global settings during SSG
async function fetchGlobalSettings() {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8055'
  try {
    const response = await axios.get(`${backendUrl}/items/settings`)
    return {
      displayLegal: response.data.data.display_legal,
      showBuyMeACoffee: response.data.data.show_buy_me_a_coffee
    }
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return {
      displayLegal: false,
      showBuyMeACoffee: true
    }
  }
}

// Fetch static pages
async function fetchStaticPages() {
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8055'
  try {
    const response = await axios.get(`${backendUrl}/items/staticpages`)
    
    // Create a map of pages by slug and language
    const pageMap = {}
    response.data.data.forEach(page => {
      if (!pageMap[page.slug]) pageMap[page.slug] = {}
      pageMap[page.slug][page.language] = page
    })
    
    return pageMap
  } catch (error) {
    console.error('Error fetching static pages:', error)
    return {}
  }
}

export async function render(url, manifest) {
  // Create app instance
  const app = createSSRApp(App)
  
  // Create router instance
  const router = createRouter()
  await router.push(url)
  await router.isReady()
  
  // Create i18n instance
  const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: {
      'en-US': enUS,
      'de-DE': deDE
    }
  })
  
  // Create and use pinia
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(i18n)
  
  // Fetch data for SSG
  const [globalSettings, staticPages] = await Promise.all([
    fetchGlobalSettings(),
    fetchStaticPages()
  ])
  
  // Initialize store state
  const globalSettingsStore = useGlobalSettings(pinia)
  globalSettingsStore.displayLegal = globalSettings.displayLegal
  globalSettingsStore.showBuyMeACoffee = globalSettings.showBuyMeACoffee
  
  // Create initial state for hydration
  const initialState = {
    pinia: pinia.state.value,
    staticPages: staticPages
  }
  
  // Render the app to HTML
  const html = await renderToString(app)
  
  return { html, initialState }
} 