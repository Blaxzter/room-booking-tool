<script setup lang="ts">
import { Globe } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/composables/useLanguage'
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

defineProps({
  variant: {
    type: String as () => 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link',
    default: 'outline'
  },
  size: {
    type: String as () => 'default' | 'sm' | 'lg' | 'icon',
    default: 'sm'
  },
  flagSize: {
    type: Number,
    default: 14
  },
  showIcon: {
    type: Boolean,
    default: false
  }
})

const { currentLanguage, availableLanguages, changeLanguage } = useLanguage()
</script>

<template>
  <!-- Dropdown version (default) -->
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button :variant="variant" :size="size" class="gap-1">
        <Globe class="h-4 w-4" v-if="showIcon" />
        <span :style="{ fontSize: `${flagSize}px` }">{{ currentLanguage.flag }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem 
        v-for="lang in availableLanguages" 
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="mb-1"
        :class="{ 'bg-accent': currentLanguage.code === lang.code }"
      >
        <span class="mr-2">{{ lang.flag }}</span>
        {{ lang.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template> 