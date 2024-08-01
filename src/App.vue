<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { showAlertDialog } from '@/plugins/alert-dialog-plugin'

import { computed, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useInitialDataStore } from '@/stores/initial'
import VersionDisplay from '@/components/utils/VersionDisplay.vue'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'

const { init_loading } = storeToRefs(useInitialDataStore())

const isDark = useDark()

// add var for dark mode
const darkModeVar = computed(() => {
  return `--dark-mode: ${isDark.value ? 'true' : 'false'}`
})

provide(
  'backendUrl',
  import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : `https://api.${window.location.host}`
)
provide('showAlertDialog', showAlertDialog)
</script>

<template>
  <div :style="darkModeVar">
    <div v-if="init_loading" class="loading">
      <div class="flex items-center justify-center h-full">
        <CalenderLoader :height="400" />
      </div>
    </div>
    <RouterView v-show="!init_loading" />
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
