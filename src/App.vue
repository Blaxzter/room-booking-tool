<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-items: center;
  height: 100vh;
}
</style>
