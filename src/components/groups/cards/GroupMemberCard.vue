<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GroupMemberBody from '@/components/groups/bodys/GroupMemberBody.vue'
import type { Group } from '@/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('groups.cards.groupMemberCard.title') }}</CardTitle>
      <CardDescription>{{ t('groups.cards.groupMemberCard.description') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <GroupMemberBody :group="group" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
