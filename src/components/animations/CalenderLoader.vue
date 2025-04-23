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
  <ClientOnly>
    <LottieAnimation
      :animationData="isDark ? flatten('#f8fafc', loader) : loader"
      :auto-play="true"
      :loop="true"
      :speed="4"
      :style="{ height: `${props.height}px` }"
    />
    
    <template #placeholder>
      <div :style="{ height: `${props.height}px`, width: `${props.height * 1.5}px` }" 
           class="bg-muted animate-pulse rounded-lg"></div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
