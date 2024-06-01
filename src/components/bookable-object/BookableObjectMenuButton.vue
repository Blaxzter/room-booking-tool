<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

import { EllipsisVertical, LinkIcon, EditIcon } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const router = useRouter()

const open = defineModel({
  type: Boolean,
  default: false
})

defineProps<{
  bookableObjectId: number
  bookableObjectUniqueId: string
  bookableObjectType: string | undefined
}>()
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
          <span>Sharing Page</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="hover:cursor-pointer"
          @click.stop="router.push({ name: 'bookable-object-edit', params: { id: bookableObjectId } })"
        >
          <EditIcon class="mr-2 h-4 w-4" />
          <span>Edit Page</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
