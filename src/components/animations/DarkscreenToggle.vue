<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { LottieAnimation } from 'lottie-web-vue'
import darkmode from '@/assets/animations/darkmode.json'
import { useDark } from '@vueuse/core'

const isDark = useDark()

// Just type it as any for now since we're using the wrapper library
const anim = ref<any>(null)

const currentFrame = ref(0)
const currentDirection = ref(1)
const darkFrame = 235

const props = defineProps({
  height: { type: Number, default: 24 },
  toggleAnimation: { type: Boolean, default: false }
})

onMounted(async () => {
  if (!anim.value) return

  if (isDark.value) {
    currentFrame.value = darkFrame
  }
  anim.value.goToAndStop(currentFrame.value, true)
})

function play() {
  if (!anim.value) return

  currentDirection.value = 1
  anim.value.setDirection(1)
  anim.value.play()
}

function stop() {
  if (!anim.value) return

  currentDirection.value = -1
  anim.value.setDirection(-1)
  anim.value.play()
}

watch(
  () => props.toggleAnimation,
  () => {
    if (props.toggleAnimation) {
      play()
    } else {
      stop()
    }
  }
)

const enterFrame = () => {
  if (!anim.value) return

  currentFrame.value += currentDirection.value
  if (currentFrame.value === darkFrame) {
    anim.value.goToAndStop(darkFrame, true)
    currentFrame.value = darkFrame
  }
}
</script>

<template>
  <ClientOnly>
    <LottieAnimation
      ref="anim"
      :animation-data="darkmode"
      :auto-play="false"
      :loop="false"
      :speed="3"
      :style="{ height: `${props.height}px` }"
      @enterFrame="enterFrame"
    />
    
    <template #placeholder>
      <div :style="{ height: `${props.height}px`, width: `${props.height}px` }" 
           class="flex items-center justify-center rounded-full border">
        <div class="text-xs">
          {{ isDark ? '🌙' : '☀️' }}
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped></style>
