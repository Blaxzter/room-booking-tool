<script setup lang="ts">
import type { Group } from '@/types'

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import GroupMemberCard from '@/components/groups/bodys/GroupMemberBody.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Team Members</DialogTitle>
      <DialogDescription> Invite your team members to collaborate. </DialogDescription>
    </DialogHeader>
    <GroupMemberCard :group="group" />
  </DialogContent>
</template>
