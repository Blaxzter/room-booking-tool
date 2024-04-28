<template>
  <transition name="fade" mode="out-in">
    <span :key="currentMessage">{{ currentMessage }}</span>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  } as any as PropType<string[]>
})

const messageIndex = ref(0)

const currentMessage = computed(() => {
  return props.messages![messageIndex.value] as string
})

onMounted(() => {
  setInterval(() => {
    messageIndex.value = (messageIndex.value + 1) % props.messages!.length
  }, 4000)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
</style>
