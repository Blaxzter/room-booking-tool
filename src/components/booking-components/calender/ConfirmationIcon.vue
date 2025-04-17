<script setup lang="ts">
import { CheckIcon, CircleHelpIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const { t } = useI18n()

defineProps({
  confirmed: Boolean,
  size: {
    type: Number,
    default: 20
  }
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <CheckIcon :size="size" v-if="confirmed" />
        <CircleHelpIcon :size="size" v-else />
      </TooltipTrigger>
      <TooltipContent>
        <p v-if="confirmed">{{ t('bookingComponents.calender.confirmationIcon.confirmed') }}</p>
        <p v-else>{{ t('bookingComponents.calender.confirmationIcon.notConfirmedYet') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
