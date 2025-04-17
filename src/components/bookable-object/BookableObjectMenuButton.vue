<script lang="ts" setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { EllipsisVertical, LinkIcon, EditIcon, TrashIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useToast } from '@/components/ui/toast'
import type { ShowAlertFunction } from '@/plugins/alert-dialog-plugin'

const router = useRouter()
const { t } = useI18n()

const open = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps<{
  bookableObjectId: string
  bookableObjectUniqueId: string | undefined
  bookableObjectType: string | undefined
  isInternal?: boolean
}>()

const showAlertDialog = inject('showAlertDialog') as ShowAlertFunction
const deleteBookableObject = async () => {
  showAlertDialog({
    title: t('bookableObject.menuButton.deleteAlert.title'),
    description: t('bookableObject.menuButton.deleteAlert.description'),
    onConfirm: async () => {
      const { deleteBookableObject } = useBookableObjects()
      await deleteBookableObject(props.bookableObjectId).then(() => {
        const { toast } = useToast()
        toast({
          title: t('bookableObject.menuButton.deleteToast.title'),
          description: t('bookableObject.menuButton.deleteToast.description'),
          variant: 'success'
        })
      })
    },
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirmText: t('bookableObject.menuButton.deleteAlert.confirmButton')
  })
}
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" @click.stop="open = true">
        <EllipsisVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-if="props.isInternal"
          class="hover:cursor-pointer"
          @click.stop="router.push(`/${bookableObjectType}/${bookableObjectUniqueId}`)"
        >
          <LinkIcon class="mr-2 h-4 w-4" />
          <span>{{ t('bookableObject.menuButton.shareView') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="hover:cursor-pointer"
          @click.stop="router.push({ name: 'bookable-object-edit', params: { id: bookableObjectId } })"
        >
          <EditIcon class="mr-2 h-4 w-4" />
          <span>{{ t('bookableObject.menuButton.edit') }}</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="hover:cursor-pointer" @click.stop="deleteBookableObject">
          <TrashIcon class="mr-2 h-4 w-4 text-red-500" />
          <span>{{ t('bookableObject.menuButton.delete') }}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
