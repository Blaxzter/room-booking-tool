<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EmailConfirmedAnimation from '@/components/animations/EmailConfirmedAnimation.vue'
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-xl"> Email Verified </CardTitle>
      <CardDescription> Your email has been verified. </CardDescription>
    </CardHeader>
    <CardContent>
      <EmailConfirmedAnimation :height="150" />
      <div class="mt-4 text-center text-sm">
        You will automatically be redirected to the login page in 5 seconds. Or you can go back to
        <router-link to="/login" class="underline"> login </router-link> by clicking this link.
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
