<script setup lang="ts">
import TopNav from '@/layouts/TopNav.vue'
</script>

<template>
  <div class="max-h-screen overflow-hidden h-screen">
    <TopNav />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.main-content {
  height: calc(100vh - 65px);
  max-height: calc(100vh - 65px);
  overflow-y: hidden;
}
</style>
