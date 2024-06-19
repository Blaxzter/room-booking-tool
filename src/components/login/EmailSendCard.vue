<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-xl">Verification Email Sent</CardTitle>
      <CardDescription>Please check your email to verify your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="mt-4 text-center text-sm">
        Go back to
        <router-link to="/login" class="underline"> login </router-link>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
