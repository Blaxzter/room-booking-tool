<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:gap-0 justify-between">
    <div>
      <div class="text-xl font-bold mb-2">{{ t('settings.telegram.title') }}</div>
      <div class="text-muted-foreground">{{ t('settings.telegram.description') }}</div>
    </div>
    <div v-if="isLinked">
      <div class="flex items-start gap-2">
        <img src="../../assets/logos/telegram.webp" class="w-8 h-8" alt="Telegram Logo" />
        <div class="flex-shrink text-center">
          {{ t('settings.telegram.accountLinked') }} <br />
          {{ t('settings.telegram.linkedTo') }} <span class="font-bold">@{{ user.telegram_user_name }}</span>
        </div>
        <CheckIcon class="w-5 h-5 text-success me-5 mt-3" />
        <Button variant="destructive" @click="removeTelegramId" size="icon">
          <TrashIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
    <div v-else ref="telegramWidget"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { CheckIcon, TrashIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { useUser } from '@/stores/user'
import { useToast } from '@/components/ui/toast'

const { t } = useI18n()
const { addTelegramId } = useUser()
const { user } = storeToRefs(useUser())
const { toast } = useToast()

async function onTelegramAuth(user: any) {
  await addTelegramId(user.id, user.username)
  toast({
    variant: 'success',
    title: t('settings.toast.title'),
    description: t('settings.telegram.toast.linked')
  })
}

async function removeTelegramId() {
  await addTelegramId(null, null)
  toast({
    variant: 'success',
    title: t('settings.toast.title'),
    description: t('settings.telegram.toast.unlinked')
  })
  createTelegramWidget()
}

const telegramWidget = ref(null)
const telegramWidgetCreated = ref(false)

const isLinked = computed(() => user.value.telegram_user_id)

declare global {
  interface Window {
    onTelegramAuth: any
  }
}

function createTelegramWidget() {
  if (telegramWidgetCreated.value) {
    return
  }
  telegramWidgetCreated.value = true

  window.onTelegramAuth = onTelegramAuth

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'BookiToolBot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')

  if (telegramWidget.value) {
    /* @ts-expect-error - Telegram widget interface isn't fully typed */
    telegramWidget.value.appendChild(script)
  }
}

onMounted(() => {
  if (isLinked.value) {
    return
  }
  createTelegramWidget()
})
</script>
