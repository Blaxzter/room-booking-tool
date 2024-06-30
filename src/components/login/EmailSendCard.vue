<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
            <div class="text-2xl font-normal text-muted-foreground">Verification Email Sent</div>
          </div>
        </div>
      </CardTitle>
      <CardDescription>Please check your email to verify your account.</CardDescription>
    </CardHeader>
    <CardContent class="max-w-sm m-auto">
      <div class="mt-4 text-center text-sm">
        Go back to
        <router-link to="/login" class="underline"> login </router-link>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
