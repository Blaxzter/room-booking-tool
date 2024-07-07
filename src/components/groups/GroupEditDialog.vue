<script setup lang="ts">
import type { Group } from '@/types'

import { DialogContent } from '@/components/ui/dialog'
import GroupMemberCard from '@/components/groups/GroupMemberCard.vue'

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <DialogContent>
    <GroupMemberCard :group="group" />
  </DialogContent>
</template>
