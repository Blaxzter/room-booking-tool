<script setup lang="ts">
import type { Group } from '@/types'

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import GroupMemberCard from '@/components/groups/bodys/GroupMemberBody.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{{ t('groups.dialogs.groupMember.title') }}</DialogTitle>
      <DialogDescription>{{ t('groups.dialogs.groupMember.description') }}</DialogDescription>
    </DialogHeader>
    <GroupMemberCard :group="group" />
  </DialogContent>
</template>
