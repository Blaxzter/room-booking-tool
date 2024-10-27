<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

// define emits for prev and next
const emits = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="flex gap-0.5">
    <Button variant="secondary" size="icon" @click="emits('prev')">
      <ChevronLeft />
    </Button>
    <Button variant="secondary" size="icon" @click="emits('next')">
      <ChevronRight />
    </Button>
  </div>
</template>

<style scoped></style>
