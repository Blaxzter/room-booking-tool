<template>
  <Dialog v-model:open="isOpen" @close="handleClose">
    <DialogContent :trap-focus="true" :is-global="true">
      <DialogHeader>
        <DialogTitle :class="[`text-${options?.type || 'default'}`]">
          {{ options?.title }}
        </DialogTitle>
      </DialogHeader>
      <div class="py-2">
        <p class="text-gray-600">{{ options?.message }}</p>
      </div>
      <DialogFooter class="flex justify-end gap-2">
        <Button variant="outline" @click="handleCancel">
          {{ options?.cancelText || 'Cancel' }}
        </Button>
        <Button 
          :variant="getConfirmButtonVariant()" 
          @click="handleConfirm"
        >
          <component :is="options?.confirmIcon" v-if="options?.confirmIcon" class="h-4 w-4 mr-2" />
          {{ options?.confirmText || 'Confirm' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDialogStore } from '@/stores/dialog'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

const dialogStore = useDialogStore()
const { isOpen, options } = storeToRefs(dialogStore)

const getConfirmButtonVariant = () => {
  if (options.value?.confirmVariant === 'primary') {
    return 'default'
  }
  if (options.value?.confirmVariant === 'destructive') {
    return 'destructive'
  }
  return options.value?.type === 'error' ? 'destructive' : 'default'
}

const handleClose = () => {
  dialogStore.hide()
}

const handleConfirm = async () => {
  await dialogStore.confirm()
}

const handleCancel = async () => {
  await dialogStore.cancel()
}
</script>

<style>
.dialog-content {
  z-index: 1000 !important;
}

.drawer-content {
  z-index: 1000 !important;
}
</style> 