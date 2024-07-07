<script setup lang="ts">
import { defineProps } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Group } from '@/types'
import GroupDataBody from '@/components/groups/bodys/GroupDataBody.vue'

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ group?.name }}</CardTitle>
      <CardDescription> Edit your group data. </CardDescription>
    </CardHeader>
    <CardContent>
      <GroupDataBody :group="group" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
