<script setup lang="ts">
import type { PropType } from 'vue'
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
import { CheckIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  onConfirm: {
    type: Function as PropType<(...args: any[]) => void>,
    required: true
  },
  onDismiss: {
    type: Function as PropType<(...args: any[]) => void>,
    default: () => () => {}
  },
  confirmIcon: {
    type: Object,
    default: () => CheckIcon
  },
  confirmVariant: {
    type: String,
    default: 'destructive'
  },
  onConfirmText: {
    type: String,
    default: 'Continue'
  }
})
</script>

<template>
  <AlertDialog :open="true">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onDismiss">Cancel</AlertDialogCancel>

        <AlertDialogAction @click="onConfirm" :varient="confirmVariant">
          <component :is="confirmIcon" class="w-4 h-4 me-2" />
          <slot name="confirm">
            {{ onConfirmText }}
          </slot>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
