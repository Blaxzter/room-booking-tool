<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

import type { Group, User } from '@/types'
import { useGroups } from '@/stores/groups'
import { useUser } from '@/stores/user'
import GroupListEntry from '@/components/groups/GroupListEntry.vue'

const { t } = useI18n()
const { groups } = storeToRefs(useGroups())

const { user } = storeToRefs(useUser())

// create a computed that are the groups the user is owner of
const ownedGroups = computed(() => {
  return groups.value.filter((group) => (group.owner as { id: string })?.id === user.value.id)
})

const invitedGroups = computed(() => {
  // remove groups where the user is only the inviti
  return groups.value.filter(
    (group) =>
      (group.owner as { id: string })?.id !== user.value.id &&
      _.find(group.users, (u) => (u.directus_users_id as User).id === user.value.id)
  )
})

const pendingGroups = computed(() => {
  return groups.value.filter(
    (group) =>
      (group.owner as { id: string })?.id !== user.value.id &&
      !_.find(group.users, (u) => (u.directus_users_id as User).id === user.value.id)
  )
})

const groupIterative = ref([
  {
    title: t('groups.groupList.pendingInvites'),
    groups: pendingGroups,
    showRole: false,
    isInvite: true
  },
  {
    title: t('groups.groupList.yourGroups'),
    groups: ownedGroups,
    showRole: false,
    isInvite: false
  },
  {
    title: t('groups.groupList.invitedGroups'),
    groups: invitedGroups,
    showRole: true,
    isInvite: false
  }
])

const selectedEditGroup = ref<Group | undefined>(undefined)

defineEmits(['selectGroup'])
</script>

<template>
  <div class="flex gap-2 flex-col max-w-full" v-if="groups.length !== 0">
    <template v-for="groupType in groupIterative" :key="groupType.title">
      <div class="font-semibold text-lg text-primary mt-3" v-if="groupType.groups.length">{{ groupType.title }}</div>
      <GroupListEntry
        v-for="group of groupType.groups"
        :key="group.id"
        :isSelected="selectedEditGroup === group"
        :group="group"
        :show-role="groupType.showRole"
        :isInvite="groupType.isInvite"
        class="max-w-full"
        @click="
          () => {
            if (groupType.isInvite) {
              return
            }
            selectedEditGroup = group
            $emit('selectGroup', group)
          }
        "
      />
    </template>
  </div>
  <div class="text-center text-muted-foreground text-sm mb-4" v-else>
    {{ t('groups.groupList.noGroups') }}
  </div>
</template>
