<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import rocket from '@/assets/animations/rocketstart.json'

defineProps({
  height: { type: Number, default: 500 }
})
</script>

<template>
  <LottieAnimation :animationData="rocket" :auto-play="true" :loop="false" :speed="1" :style="{ height: `100%` }" />
</template>

<style scoped></style>
