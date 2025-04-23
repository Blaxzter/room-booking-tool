<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import rocket from '@/assets/animations/rocketstart.json'

defineProps({
  height: { type: Number, default: 500 }
})
</script>

<template>
  <ClientOnly>
    <LottieAnimation 
      :animationData="rocket" 
      :auto-play="true" 
      :loop="false" 
      :speed="1" 
      :style="{ height: `100%` }" 
    />
    
    <template #placeholder>
      <div class="h-full w-full flex items-center justify-center">
        <div class="bg-muted animate-pulse rounded-lg h-64 w-32"></div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
