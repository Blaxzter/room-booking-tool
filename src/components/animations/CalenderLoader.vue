<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import loader from '@/assets/animations/loader.json'
import { flatten } from 'lottie-colorify'

const props = defineProps({
  height: { type: Number, default: 24 }
})
</script>

<template>
  <LottieAnimation
    :animation-data="flatten('#f8fafc', loader)"
    :auto-play="true"
    :loop="true"
    :speed="4"
    :style="{ height: `${props.height}px` }"
  />
</template>

<style scoped></style>
