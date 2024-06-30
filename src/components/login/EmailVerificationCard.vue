<script setup lang="ts">
// card that is displayed when the email is beeing verified
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import LogoImage from '@/components/bits/LogoImage.vue'
</script>

<template>
  <Card class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl grid place-content-center">
    <CardHeader class="max-w-sm m-auto">
      <CardTitle class="text-2xl">
        <div class="flex items-center gap-4 mb-3">
          <LogoImage />
          <div class="text-3xl font-bold">
            <div>BookiTool</div>
            <div class="text-2xl font-normal text-muted-foreground">Email is being verified</div>
          </div>
        </div>
      </CardTitle>
      <CardDescription> Please wait while we verify your email. </CardDescription>
    </CardHeader>
    <CardContent class="max-w-sm m-auto">
      <CalenderLoader :height="200" />
      <div class="mt-4 text-center text-sm">
        This should take only a few seconds. If it takes longer, please contact support.
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
