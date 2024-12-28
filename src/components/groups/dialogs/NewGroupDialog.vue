<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import GroupDataCard from '@/components/groups/bodys/GroupDataBody.vue'

defineEmits(['created', 'close'])

defineProps({
  showDialog: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <DialogContent v-if="showDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create group</DialogTitle>
        <DialogDescription> Add a new group to manage rooms and other bookable objects. </DialogDescription>
      </DialogHeader>
      <GroupDataCard @created="$emit('created', $event)" @close="$emit('close')">
        <DialogFooter>
          <Button variant="outline" @click="$emit('close')"> Cancel </Button>
          <Button type="submit" class="mb-2 sm:mb-0"> Create </Button>
        </DialogFooter>
      </GroupDataCard>
    </DialogContent>
  </DialogContent>

  <DrawerContent v-else>
    <DrawerHeader class="text-left">
      <DrawerTitle>Create Group</DrawerTitle>
      <DrawerDescription> Add a new group to manage rooms and other bookable objects. </DrawerDescription>
    </DrawerHeader>
    <div class="p-6 max-h-[80%] overflow-y-auto">
      <GroupDataCard @created="$emit('created', $event)" @close="$emit('close')">
        <DrawerFooter class="-m-4">
          <Button variant="outline" @click="$emit('close')"> Cancel </Button>
          <Button type="submit" class="mb-2 sm:mb-0"> Create </Button>
        </DrawerFooter>
      </GroupDataCard>
    </div>
  </DrawerContent>
</template>

<style></style>
