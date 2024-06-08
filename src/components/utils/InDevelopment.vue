<template>
  <div class="parent" @click="handleClick">
    <div class="background absolute"></div>
    <div class="banner" ref="shakeElement">In Development</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const shakeElement = ref<HTMLElement | null>(null)

const handleClick = (event: MouseEvent) => {
  // Prevent clicking on the content
  event.stopPropagation()
  // Add the shake animation
  shakeElement.value?.classList.add('shake')
  setTimeout(() => {
    shakeElement.value?.classList.remove('shake')
  }, 500)
}
</script>

<style scoped>
.parent {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.background {
  background-color: lightgray;
  z-index: 1000;
  opacity: 0.1;
  transform: scale(1.05);
  pointer-events: none;
  border-radius: 15px;
  width: 100%;
  height: 100%;
}

.banner {
  color: white;
  background-color: rgba(127, 29, 29, 0.4);
  border-radius: 15px;
  font-size: 3rem;
  padding: 5px 10px 15px 1px;
  transform: rotate(-45deg);
  transform-origin: center center;
  pointer-events: all;
  user-select: none;
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(-45deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-46deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(-44deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(-45deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(-44deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-46deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(-45deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-46deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(-44deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(-45deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-46deg);
  }
}
</style>
