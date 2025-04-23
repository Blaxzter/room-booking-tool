import { createApp } from './main'

const { app, router, pinia } = createApp()

// Wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  // Add initial state from SSG
  if (window.__INITIAL_STATE__) {
    pinia.state.value = window.__INITIAL_STATE__.pinia
  }
  
  app.mount('#app')
}) 