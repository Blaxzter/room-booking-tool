<script lang="ts" setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

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

const open = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps<{
  bookableObjectId: string
  bookableObjectUniqueId: string | undefined
  bookableObjectType: string | undefined
}>()

const showAlertDialog = inject('showAlertDialog') as ShowAlertFunction
const deleteBookableObject = async () => {
  showAlertDialog({
    title: 'Delete bookable object',
    description: 'Are you sure you want to delete this bookable object?',
    onConfirm: async () => {
      const { deleteBookableObject } = useBookableObjects()
      console.log('Deleting bookable object with id:', props.bookableObjectId)
      await deleteBookableObject(props.bookableObjectId).then(() => {
        const { toast } = useToast()
        toast({
          title: 'Bookable object removed',
          description: `The bookable object has been removed.`,
          variant: 'success'
        })
      })
    },
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirmText: 'Delete'
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
          class="hover:cursor-pointer"
          @click.stop="router.push(`/${bookableObjectType}/${bookableObjectUniqueId}`)"
        >
          <LinkIcon class="mr-2 h-4 w-4" />
          <span>Sharing View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="hover:cursor-pointer"
          @click.stop="router.push({ name: 'bookable-object-edit', params: { id: bookableObjectId } })"
        >
          <EditIcon class="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="hover:cursor-pointer" @click.stop="deleteBookableObject">
          <TrashIcon class="mr-2 h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
