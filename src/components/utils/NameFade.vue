<template>
  <transition name="fade" mode="out-in">
    <span :key="currentMessage">{{ currentMessage }}</span>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'
import { useBookableObjectTerms, BookableObjectTermType } from '@/composables/useBookableObjectTerms'

const props = defineProps({
  messages: {
    type: Array as PropType<string[]>,
    required: false
  },
  termType: {
    type: String as PropType<BookableObjectTermType>,
    default: BookableObjectTermType.PLURAL
  }
})

const emit = defineEmits(['valueChanged'])

const { getBookableObjectTerms } = useBookableObjectTerms()
const messageIndex = ref(0)

const currentMessage = computed(() => {
  // If messages are provided, use them, otherwise use the internationalized terms
  const messageList = props.messages || getBookableObjectTerms(props.termType as BookableObjectTermType)
  return messageList[messageIndex.value] as string
})

onMounted(() => {
  setInterval(() => {
    // If messages are provided, use their length, otherwise use the internationalized terms length
    const messageList = props.messages || getBookableObjectTerms(props.termType as BookableObjectTermType)
    messageIndex.value = (messageIndex.value + 1) % messageList.length
    emit('valueChanged', currentMessage.value)
  }, 4000)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
</style>
