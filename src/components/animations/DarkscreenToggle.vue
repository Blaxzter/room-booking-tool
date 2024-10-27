<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { LottieAnimation } from 'lottie-web-vue'
import darkmode from '@/assets/animations/darkmode.json'
import { useDark } from '@vueuse/core'

const isDark = useDark()

let anim = ref()

const currentFrame = ref(0)
const currentDirection = ref(1)
const darkFrame = 235

const props = defineProps({
  height: { type: Number, default: 24 },
  toggleAnimation: { type: Boolean, default: false }
})

onMounted(async () => {
  if (isDark.value) {
    currentFrame.value = darkFrame
  }
  anim.value.goToAndStop(currentFrame.value, true)
})

function play() {
  currentDirection.value = 1
  anim.value.setDirection(1) // Ensures the animation plays forward
  anim.value.play()
}

function stop() {
  currentDirection.value = -1
  anim.value.setDirection(-1) // Optionally reverse the direction on leave
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
  currentFrame.value += currentDirection.value
  if (currentFrame.value === darkFrame) {
    anim.value.goToAndStop(darkFrame, true)
    currentFrame.value = darkFrame
  }
}
</script>

<template>
  <LottieAnimation
    ref="anim"
    :animation-data="darkmode"
    :auto-play="false"
    :loop="false"
    :speed="3"
    :style="{ height: `${props.height}px` }"
    @enter-frame="enterFrame"
  />
</template>

<style scoped></style>
