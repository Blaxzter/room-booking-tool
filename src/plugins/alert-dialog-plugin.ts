import type { Component } from 'vue'
import { createVNode, render } from 'vue'
import AlertDialogComponent from '@/components/utils/AlertDialogComponent.vue'

export type ShowAlertFunction = (options: {
  title: string
  description: string
  onConfirm: () => void
  confirmIcon?: Component
  confirmVariant?: 'primary' | 'destructive'
  onConfirmText?: string
}) => void

export function showAlertDialog({
  title,
  description,
  onConfirm,
  confirmIcon,
  confirmVariant,
  onConfirmText
}: {
  title: string
  description: string
  onConfirm: () => void
  confirmIcon?: Component
  confirmVariant?: 'primary' | 'destructive'
  onConfirmText?: string
}) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  render(
    createVNode(AlertDialogComponent, {
      title,
      description,
      onConfirm: () => {
        onConfirm()
        render(null, container)
        document.body.removeChild(container)
      },
      onDismiss: () => {
        render(null, container)
        document.body.removeChild(container)
      },
      confirmIcon,
      confirmVariant,
      onConfirmText
    }),
    container
  )
}
