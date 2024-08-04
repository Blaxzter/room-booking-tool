<script setup lang="ts">
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

// define emits for prev and next
const emits = defineEmits(['prev', 'next'])
</script>

<template>
  <div class="flex gap-0.5">
    <Button @click="emits('prev')" variant="secondary" size="icon">
      <ChevronLeft />
    </Button>
    <Button @click="emits('next')" variant="secondary" size="icon">
      <ChevronRight />
    </Button>
  </div>
</template>

<style scoped></style>
