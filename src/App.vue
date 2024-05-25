<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'
import Toaster from '@/components/ui/toast/Toaster.vue'

const isDark = useDark()

// add var for dark mode
const darkModeVar = computed(() => {
  return `--dark-mode: ${isDark.value ? 'true' : 'false'}`
})
</script>

<template>
  <div :style="darkModeVar">
    <RouterView />
  </div>
  <Toaster />
</template>

<style scoped></style>
