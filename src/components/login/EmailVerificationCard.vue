<script setup lang="ts">
// card that is displayed when the email is beeing verified
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-xl"> Email is being verified </CardTitle>
      <CardDescription> Please wait while we verify your email. </CardDescription>
    </CardHeader>
    <CardContent>
      <CalenderLoader :height="200" />
      <div class="mt-4 text-center text-sm">
        This should take only a few seconds. If it takes longer, please contact support.
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
