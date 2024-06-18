<script setup lang="ts">
import { Card, CardContent, CardTitle } from '@/components/ui/card'

defineProps({
  showCheckmark: Boolean,
  showCross: Boolean,
  showScreenGrower: Boolean
})
</script>

<template>
  <Card class="w-full max-w-sm h-full max-h-[200px]" :class="{ 'login-screen-grower': showScreenGrower }">
    <CardContent class="grid place-items-center pt-6" :class="{ 'fade-out': showScreenGrower }">
      <div class="circle-loader mb-2 h-[200px]" :class="{ 'load-complete': showCheckmark, error: showCross }">
        <div class="checkmark draw" :style="{ display: !showCheckmark ? 'none' : 'block' }"></div>
        <div class="cross draw" :style="{ display: !showCross ? 'none' : 'block' }"></div>
      </div>
      <CardTitle v-if="showCheckmark"> Authenticated </CardTitle>
      <CardTitle v-else-if="showCross"> Invalid email or password </CardTitle>
      <CardTitle v-else> Logging in </CardTitle>
    </CardContent>
  </Card>
</template>

<style scoped></style>
