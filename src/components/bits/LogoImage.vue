<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark()

defineProps({
  widthHeight: {
    type: String,
    default: 'w-20 h-20'
  }
})
</script>

<template>
  <img src="/logo.svg" alt="Logo" class="white-logo logo" :class="[isDark ? 'dark-logo' : 'white-logo', widthHeight]" />
</template>

<style scoped>
.logo {
  margin-left: -0.3rem;
}

.white-logo {
  filter: invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
  cursor: pointer;
}
.dark-logo {
  filter: invert(94%) sepia(7%) saturate(750%) hue-rotate(185deg) brightness(105%) contrast(100%);
  cursor: pointer;
}
</style>
