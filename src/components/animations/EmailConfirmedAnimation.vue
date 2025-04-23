<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import rocket from '@/assets/animations/emailconfirmed.json'

const props = defineProps({
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
      :style="{ height: `${props.height}px` }"
    />
    
    <template #placeholder>
      <div :style="{ height: `${props.height}px` }" 
           class="flex items-center justify-center">
        <div class="text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
