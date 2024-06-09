<script setup lang="ts">
import { CheckIcon, CircleHelpIcon } from 'lucide-vue-next'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps({
  confirmed: Boolean
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <CheckIcon :size="20" v-if="confirmed" />
        <CircleHelpIcon :size="20" v-else />
      </TooltipTrigger>
      <TooltipContent>
        <p v-if="confirmed">Confirmed</p>
        <p v-else>Not confirmed yet</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
