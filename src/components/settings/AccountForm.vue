<script setup lang="ts">
import DeleteAccountDialog from '@/components/settings/DeleteAccountDialog.vue'
import TelegramLogin from '@/components/settings/TelegramLogin.vue'
</script>

<template>
  <div>
    <div class="text-xl font-bold mb-5">Integrations</div>
    <TelegramLogin />
  </div>
  <DeleteAccountDialog />
</template>
