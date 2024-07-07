<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import GroupList from '@/components/groups/GroupList.vue'
import { useInitialDataStore } from '@/stores/initial'
import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import type { Group } from '@/types'
import GroupMemberCard from '@/components/groups/cards/GroupMemberCard.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GroupDataCard from '@/components/groups/cards/GroupDataCard.vue'
import { ScrollArea } from '@/components/ui/scroll-area'

const { fetchGroupData } = useInitialDataStore()
const { init_loading } = storeToRefs(useInitialDataStore())

const selectedGroup = ref<Group | undefined>(undefined)

onMounted(async () => {
  await fetchGroupData()
})
</script>

<template>
  <div class="container pt-8 mx-auto border border-red-500 max-h-full overflow-hidden">
    <CalenderLoader :height="150" v-if="init_loading" />
    <div
      v-else
      class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch border border-red-500 h-full max-h-full overflow-hidden"
    >
      <ScrollArea>
        <GroupList @select-group="selectedGroup = $event" />
      </ScrollArea>
      <ScrollArea class="max-h-full overflow-hidden">
        <Tabs default-value="account" v-if="selectedGroup">
          <TabsList>
            <TabsTrigger value="account"> Group Information </TabsTrigger>
            <TabsTrigger value="password"> Members </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <GroupDataCard :group="selectedGroup" />
          </TabsContent>
          <TabsContent value="password">
            <GroupMemberCard :group="selectedGroup" />
          </TabsContent>
        </Tabs>
        <div v-else class="flex justify-center items-center h-96">
          <p class="text-lg text-gray-500">Select a group to view details.</p>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<style scoped></style>
