<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <nav
    class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground"
    :aria-label="t('legal.ariaLabel')"
  >
    <router-link to="/terms-of-service" class="underline hover:text-foreground">
      {{ t('legal.termsOfService') }}
    </router-link>
    <span aria-hidden="true">·</span>
    <router-link to="/privacy" class="underline hover:text-foreground">
      {{ t('legal.privacyPolicy') }}
    </router-link>
    <span aria-hidden="true">·</span>
    <router-link to="/impressum" class="underline hover:text-foreground">
      {{ t('legal.impressum') }}
    </router-link>
  </nav>
</template>
