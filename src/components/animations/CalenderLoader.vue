<script setup lang="ts">
import { LottieAnimation } from 'lottie-web-vue'
import loader from '@/assets/animations/loader.json'
import { flatten } from 'lottie-colorify'
import { useDark } from '@vueuse/core'

const props = defineProps({
  height: { type: Number, default: 24 }
})


const isDark = useDark()

</script>

<template>
  <LottieAnimation
    :animationData="isDark ? flatten('#f8fafc', loader) : loader"
    :auto-play="true"
    :loop="true"
    :speed="4"
    :style="{ height: `${props.height}px` }"
  />
</template>

<style scoped></style>
