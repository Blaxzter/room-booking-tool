<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import GroupList from '@/components/groups/GroupList.vue'
import { useInitialDataStore } from '@/stores/initial'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import type { Group } from '@/types'
import GroupMemberCard from '@/components/groups/GroupMemberCard.vue'

const { fetchGroupData } = useInitialDataStore()
const { init_loading } = storeToRefs(useInitialDataStore())

const selectedGroup = ref<Group | null>(null)

onMounted(async () => {
  await fetchGroupData()
})
</script>

<template>
  <div class="container mt-8 mx-auto">
    <CalenderLoader :height="150" v-if="init_loading" />
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <GroupList @select-group="selectedGroup = $event" />
      <div v-if="selectedGroup">
        <GroupMemberCard :group="selectedGroup" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
