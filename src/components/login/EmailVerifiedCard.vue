<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EmailConfirmedAnimation from '@/components/animations/EmailConfirmedAnimation.vue'
import LogoImage from '@/components/bits/LogoImage.vue'

const { t } = useI18n()
</script>

<template>
  <Card class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl grid place-content-center">
    <CardHeader class="max-w-sm m-auto">
      <CardTitle class="text-2xl">
        <div class="flex items-center gap-4 mb-3">
          <LogoImage />
          <div class="text-3xl font-bold">
            <div>BookiTool</div>
            <div class="text-2xl font-normal text-muted-foreground">{{ t('verifyEmail.success.title') }}</div>
          </div>
        </div>
      </CardTitle>
      <CardDescription>{{ t('verifyEmail.success.description') }}</CardDescription>
    </CardHeader>
    <CardContent class="max-w-sm m-auto">
      <EmailConfirmedAnimation :height="150" />
      <div class="mt-4 text-center text-sm">
        {{ t('verifyEmail.success.redirect') }}
        <router-link to="/login" class="underline">{{ t('verifyEmail.success.login') }}</router-link>
        {{ t('verifyEmail.success.byClicking') }}
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
