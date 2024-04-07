<script setup lang="ts">
import { RouterView } from 'vue-router'

// check auth before mount
import { onBeforeMount } from 'vue'
import { useAuth } from '@/stores/auth'

onBeforeMount(async () => {
  const { isAuthenticated, checkAuth } = useAuth()
  if (!isAuthenticated) {
    console.log('Checking auth')
    await checkAuth()
      .then(() => {
        console.log('Auth checked')
      })
      .catch((error) => {
        console.error(error)
      })
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
