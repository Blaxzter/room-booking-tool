<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LogoImage from '@/components/bits/LogoImage.vue'
import LoginAnimation from '@/components/login/LoginAnimation.vue'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'

defineProps({
  loading: Boolean,
  showCheckmark: Boolean,
  showCross: Boolean
})
</script>

<template>
  <Card class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl place-content-center">
    <CardHeader class="max-w-sm m-auto">
      <CardTitle class="text-2xl">
        <div class="flex gap-4 mb-1">
          <LogoImage />
          <div class="text-3xl font-bold">
            <div>BookiTool</div>
            <div class="text-2xl font-normal text-muted-foreground">Autologin</div>
          </div>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent class="grid place-items-center pt-0">
      <CalenderLoader v-if="!showCheckmark && !showCross" :height="200" />
      <LoginAnimation v-else :show-checkmark="showCheckmark" :height="200" />
      <CardTitle v-if="showCheckmark"> Authenticated </CardTitle>
      <CardTitle v-else-if="showCross"> Invalid email or password </CardTitle>
      <CardTitle v-else> Logging in </CardTitle>
    </CardContent>
  </Card>
</template>

<style scoped></style>
