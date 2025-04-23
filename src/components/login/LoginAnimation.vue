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
  <ClientOnly>
    <LottieAnimation
      v-if="showCheckmark"
      :animationData="check"
      :auto-play="true"
      :loop="false"
      :speed="1"
      :style="{ height: `${props.height}px` }"
    />
    <LottieAnimation
      v-else
      :animationData="cross"
      :auto-play="true"
      :loop="false"
      :speed="1.8"
      :style="{ height: `${props.height}px` }"
    />
    
    <template #placeholder>
      <div :style="{ height: `${props.height}px`, width: `${props.height}px` }" 
           class="bg-muted animate-pulse rounded-full"></div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
