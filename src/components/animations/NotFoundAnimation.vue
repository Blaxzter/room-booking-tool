<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import notfound from '@/assets/animations/notfound.json'

const props = defineProps({
  height: { type: Number, default: 24 }
})
</script>

<template>
  <LottieAnimation
    :animation-data="notfound"
    :auto-play="true"
    :loop="true"
    :speed="1"
    :style="{ height: `${props.height}px` }"
  />
</template>

<style scoped></style>
