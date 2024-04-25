<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import loader from '@/assets/animations/loader.json'

const props = defineProps({
  height: { type: Number, default: 24 }
})
</script>

<template>
  <LottieAnimation
    :animation-data="loader"
    :auto-play="true"
    :loop="true"
    :speed="2"
    :style="{ height: `${props.height}px` }"
  />
</template>

<style scoped></style>
