<script setup lang="ts">
import { CheckIcon, CircleHelpIcon } from 'lucide-vue-next'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
        <p v-if="confirmed">Confirmed</p>
        <p v-else>Not confirmed yet</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
