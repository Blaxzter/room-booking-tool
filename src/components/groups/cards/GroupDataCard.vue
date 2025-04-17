<script setup lang="ts">
import { defineProps } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Group } from '@/types'
import GroupDataBody from '@/components/groups/bodys/GroupDataBody.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  group: Group | undefined
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ group?.name || t('groups.cards.groupDataCard.title') }}</CardTitle>
      <CardDescription>{{ t('groups.cards.groupDataCard.description') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <GroupDataBody :group="group" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
