<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LogoImage from '@/components/bits/LogoImage.vue'

defineProps({
  showCheckmark: Boolean,
  showCross: Boolean,
  showScreenGrower: Boolean
})
</script>

<template>
  <Card
    class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl grid place-content-center"
    :class="{ 'login-screen-grower': showScreenGrower }"
  >
    <CardHeader class="max-w-sm m-auto">
      <CardTitle class="text-2xl">
        <div class="flex gap-4 mb-3">
          <LogoImage />
          <div class="text-3xl font-bold">
            <div>BookiTool</div>
            <div class="text-2xl font-normal text-muted-foreground">Autologin</div>
          </div>
        </div>
      </CardTitle>
    </CardHeader>
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
