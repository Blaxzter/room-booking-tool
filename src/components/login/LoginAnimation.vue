<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'

import check from '@/assets/animations/check.json'
import cross from '@/assets/animations/cross.json'

const props = defineProps({
  height: { type: Number, default: 24 },
  showCheckmark: Boolean
})
</script>

<template>
  <LottieAnimation
    v-if="showCheckmark"
    :animation-data="check"
    :auto-play="true"
    :loop="false"
    :speed="1"
    :style="{ height: `${props.height}px` }"
  />
  <LottieAnimation
    v-else
    :animation-data="cross"
    :auto-play="true"
    :loop="false"
    :speed="1.8"
    :style="{ height: `${props.height}px` }"
  />
</template>

<style scoped></style>
