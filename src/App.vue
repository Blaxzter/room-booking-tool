<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { showAlertDialog } from '@/plugins/alert-dialog-plugin'

import { computed, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { useInitialDataStore } from '@/stores/initial'

const { init_loading } = storeToRefs(useInitialDataStore())

const isDark = useDark()

// add var for dark mode
const darkModeVar = computed(() => {
  return `--dark-mode: ${isDark.value ? 'true' : 'false'}`
})
// provide import.meta.env.VITE_BACKEND_URL to all components as backendUrl
provide('backendUrl', import.meta.env.VITE_BACKEND_URL)
provide('showAlertDialog', showAlertDialog)
</script>

<template>
  <div :style="darkModeVar">
    <div v-if="init_loading" class="loading">
      <div class="loading__spinner"></div>
    </div>
    <RouterView v-show="!init_loading" />
  </div>
  <Toaster />
</template>

<style scoped></style>
