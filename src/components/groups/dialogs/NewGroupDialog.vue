<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import GroupDataCard from '@/components/groups/bodys/GroupDataBody.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
        <DialogTitle>{{ t('groups.dialogs.newGroupDialog.title') }}</DialogTitle>
        <DialogDescription>{{ t('groups.dialogs.newGroupDialog.description') }}</DialogDescription>
      </DialogHeader>
      <GroupDataCard @created="$emit('created', $event)" @close="$emit('close')">
        <DialogFooter>
          <Button variant="outline" @click="$emit('close')">{{ t('common.cancel') }}</Button>
          <Button type="submit" class="mb-2 sm:mb-0">{{ t('groups.dialogs.newGroupDialog.create') }}</Button>
        </DialogFooter>
      </GroupDataCard>
    </DialogContent>
  </DialogContent>

  <DrawerContent v-else>
    <DrawerHeader class="text-left">
      <DrawerTitle>{{ t('groups.dialogs.newGroupDialog.drawerTitle') }}</DrawerTitle>
      <DrawerDescription>{{ t('groups.dialogs.newGroupDialog.description') }}</DrawerDescription>
    </DrawerHeader>
    <div class="p-6 max-h-[80%] overflow-y-auto">
      <GroupDataCard @created="$emit('created', $event)" @close="$emit('close')">
        <DrawerFooter class="-m-4">
          <Button variant="outline" @click="$emit('close')">{{ t('common.cancel') }}</Button>
          <Button type="submit" class="mb-2 sm:mb-0">{{ t('groups.dialogs.newGroupDialog.create') }}</Button>
        </DrawerFooter>
      </GroupDataCard>
    </div>
  </DrawerContent>
</template>

<style></style>
