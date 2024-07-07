<script setup lang="ts">
import { defineProps } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GroupMemberBody from '@/components/groups/bodys/GroupMemberBody.vue'
import type { Group } from '@/types'

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Team Members</CardTitle>
      <CardDescription> Invite your team members to collaborate. </CardDescription>
    </CardHeader>
    <CardContent>
      <GroupMemberBody :group="group" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
