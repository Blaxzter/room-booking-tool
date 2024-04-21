<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'

const dialogOpen = defineModel<boolean>()
const props = defineProps<{ args: any }>()
const emit = defineEmits(['dismiss', 'close'])

const eventCreated = ref(false)

const closeDialogDismiss = (state: boolean) => {
  if (!state && !eventCreated.value) {
    emit('dismiss')
  }
}

const createEvent = () => {
  eventCreated.value = true
  console.log('Event created!')
  console.log(props.args)
  dialogOpen.value = false
}
</script>

<template>
  <Dialog
    v-model:open="dialogOpen"
    :modal="true"
    @update:open="closeDialogDismiss"
  >
    <DialogContent class="sm:max-w-[425px]" :trap-focus="true">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right"> Username </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button @click="createEvent"> Save changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
