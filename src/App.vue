<script setup lang="ts">
import { computed, onBeforeMount, provide } from 'vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { RouterView, useRoute } from 'vue-router'

import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useInitialDataStore } from '@/stores/initial'
import { useGlobalSettings } from '@/stores/globalSettings'

import VersionDisplay from '@/components/utils/VersionDisplay.vue'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import GlobalDialog from '@/components/GlobalDialog.vue'

const route = useRoute()
const { init_loading } = storeToRefs(useInitialDataStore())

const showLoading = computed(() => {
  if (route.meta.requiresAuth === undefined) {
    return false
  } else {
    return init_loading.value
  }
})

const isDark = useDark()

// add var for dark mode
const darkModeVar = computed(() => {
  return `--dark-mode: ${isDark.value ? 'true' : 'false'}`
})

provide(
  'backendUrl',
  import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL || 'http://localhost:8055' : `${window.location.origin}/api`
)

// Try to load pre-rendered static pages if available
let staticPages = null
if (typeof window !== 'undefined' && window.__INITIAL_STATE__?.staticPages) {
  staticPages = window.__INITIAL_STATE__.staticPages
}

// Provide static pages to be used by StaticPage.vue
provide('staticPages', staticPages)

const globalSettings = useGlobalSettings()

// before mount get initial data
onBeforeMount(async () => {
  // Only fetch global settings if not already loaded from SSG
  if (!window.__INITIAL_STATE__?.pinia?.globalSettings) {
    await globalSettings.fetchGlobalSetting()
  }
})
</script>

<template>
  <div :style="darkModeVar">
    <div v-if="showLoading" class="loading">
      <div class="flex items-center justify-center h-full">
        <CalenderLoader :height="400" />
      </div>
    </div>
    <RouterView v-show="!showLoading" />
    <GlobalDialog />
  </div>
  <Toaster />
  <VersionDisplay class="version-display" />
</template>

<style scoped>
.version-display {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0.5rem;
  font-size: 0.7rem;
  font-family: 'Roboto', sans-serif;
  color: #2c3e50;
  user-select: none;
  pointer-events: none;
}
</style>
