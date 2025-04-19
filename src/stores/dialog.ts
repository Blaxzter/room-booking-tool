import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

export const useDialogStore = defineStore('dialog', () => {
  const isOpen = ref(false)
  const options = ref<DialogOptions | null>(null)

  const show = (dialogOptions: DialogOptions) => {
    options.value = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'info',
      ...dialogOptions
    }
    isOpen.value = true
  }

  const hide = () => {
    isOpen.value = false
    options.value = null
  }

  const confirm = async () => {
    if (options.value?.onConfirm) {
      await options.value.onConfirm()
    }
    hide()
  }

  const cancel = async () => {
    if (options.value?.onCancel) {
      await options.value.onCancel()
    }
    hide()
  }

  return {
    isOpen,
    options,
    show,
    hide,
    confirm,
    cancel
  }
}) 