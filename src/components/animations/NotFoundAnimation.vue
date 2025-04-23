<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import notfound from '@/assets/animations/notfound.json'

const props = defineProps({
  height: { type: Number, default: 24 }
})
</script>

<template>
  <ClientOnly>
    <LottieAnimation
      :animation-data="notfound"
      :auto-play="true"
      :loop="true"
      :speed="1"
      :style="{ height: `${props.height}px` }"
    />
    
    <template #placeholder>
      <div :style="{ height: `${props.height}px`, width: `${props.height}px` }" 
           class="flex items-center justify-center">
        <div class="text-4xl font-bold">404</div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
