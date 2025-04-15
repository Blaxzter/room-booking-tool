<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DeleteAccountDialog from '@/components/settings/DeleteAccountDialog.vue'
import TelegramLogin from '@/components/settings/TelegramLogin.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="text-xl font-bold mb-5">{{ t('settings.account.integrations') }}</div>
    <TelegramLogin />
  </div>
  <DeleteAccountDialog />
</template>
