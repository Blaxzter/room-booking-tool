<script setup lang="ts">
import { computed } from 'vue'
import { version } from '@/version'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideVersion = computed(() => route.meta.hideVersion || false)
</script>

<template>
  <div v-if="!hideVersion">
    <p>Version: {{ version }}</p>
  </div>
</template>

<style scoped></style>
