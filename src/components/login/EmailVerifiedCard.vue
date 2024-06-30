<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EmailConfirmedAnimation from '@/components/animations/EmailConfirmedAnimation.vue'
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
            <div class="text-2xl font-normal text-muted-foreground">Email Verified</div>
          </div>
        </div>
      </CardTitle>
      <CardDescription> Your email has been verified. </CardDescription>
    </CardHeader>
    <CardContent class="max-w-sm m-auto">
      <EmailConfirmedAnimation :height="150" />
      <div class="mt-4 text-center text-sm">
        You will automatically be redirected to the login page in 5 seconds. Or you can go back to
        <router-link to="/login" class="underline"> login </router-link> by clicking this link.
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
