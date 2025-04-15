<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface Props {
  title: string;
  description: string;
  onConfirm: (...args: any[]) => void;
  onDismiss?: (...args: any[]) => void;
  confirmIcon?: any;
  confirmVariant?: string;
  onConfirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  onDismiss: () => () => {},
  confirmIcon: () => CheckIcon,
  confirmVariant: 'destructive',
  onConfirmText: undefined
})

const { t } = useI18n()
const confirmText = computed(() => props.onConfirmText ?? t('common.continue'))
</script>

<template>
  <AlertDialog :open="true">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onDismiss">{{ t('common.cancel') }}</AlertDialogCancel>

        <AlertDialogAction @click="onConfirm" :varient="confirmVariant">
          <component :is="confirmIcon" class="w-4 h-4 me-2" />
          <slot name="confirm">
            {{ confirmText }}
          </slot>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
