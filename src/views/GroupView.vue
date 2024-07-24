<script setup lang="ts">
import { onMounted, ref, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { PlusCircledIcon } from '@radix-icons/vue'
import { TrashIcon } from 'lucide-vue-next'
import _ from 'lodash'

import type { Group, User } from '@/types'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

import CalenderLoader from '@/components/animations/CalenderLoader.vue'

import GroupList from '@/components/groups/GroupList.vue'
import GroupMemberCard from '@/components/groups/cards/GroupMemberCard.vue'
import GroupDataCard from '@/components/groups/cards/GroupDataCard.vue'
import NewGroupDialog from '@/components/groups/dialogs/NewGroupDialog.vue'
import GroupEditDialog from '@/components/groups/dialogs/GroupMemberDialog.vue'

import { useInitialDataStore } from '@/stores/initial'
import { useGroups } from '@/stores/groups'
import { useUser } from '@/stores/user'

import { Dialog } from '@/components/ui/dialog'
import type { ShowAlertFunction } from '@/plugins/alert-dialog-plugin'

const { fetchGroupData } = useInitialDataStore()
const { init_loading } = storeToRefs(useInitialDataStore())
const { user } = storeToRefs(useUser())

const selectedGroup = ref<Group | undefined>(undefined)

onMounted(async () => {
  await fetchGroupData()
})

// Dialog and group creation dialog
const { groups } = storeToRefs(useGroups())
const showDialog = ref(false)
const editGroupId = ref('')
const dialogType = ref('create-group')
const selectedEditGroup = computed(() => {
  return _.find(groups.value, { id: editGroupId.value })
})

const showAlertDialog = inject('showAlertDialog') as ShowAlertFunction

const created = (group: Group) => {
  fetchGroupData().then(() => {
    dialogType.value = 'edit-group'
    editGroupId.value = group.id
  })
}

const deleteGroup = () => {
  if (!selectedGroup.value) {
    return
  }

  showAlertDialog({
    title: 'Delete Group',
    description: `Are you sure you want to delete the group "${selectedGroup.value.name}"?`,
    onConfirm: () => {
      if (!selectedGroup.value) {
        return
      }
      const { deleteGroup } = useGroups()
      deleteGroup(selectedGroup.value.id)
      selectedGroup.value = undefined
    },
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirmText: 'Delete'
  })
}

const isOwner = computed(() => {
  return (selectedGroup?.value?.owner as { id: string })?.id === user.value.id
})

const ownerEmail = computed(() => {
  if (!selectedGroup.value) {
    return ''
  }
  console.log(selectedGroup.value.users)
  return (
    _.find(
      selectedGroup.value.users,
      (u) => (u.directus_users_id as User).id === (selectedGroup.value?.owner as { id: string })?.id
    )?.directus_users_id as User
  )?.email
})
</script>

<template>
  <div class="container pt-8 mx-auto h-full max-h-full overflow-hidden">
    <CalenderLoader :height="150" v-if="init_loading" />
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch h-full max-h-full overflow-hidden">
      <ScrollArea class="mb-5 me-[-12px] pe-[12px]">
        <GroupList @select-group="selectedGroup = $event" class="mb-2" />
        <div
          class="flex rounded-lg border p-3 transition-all hover:border-indigo-500/50 cursor-pointer h-[106px] items-center justify-center text-gray-500 hover:text-indigo-500"
          @click="showDialog = true"
        >
          <div class="flex items-center gap-2">
            <PlusCircledIcon class="w-6 h-6" />
            Add Group
          </div>
        </div>
      </ScrollArea>
      <ScrollArea class="max-h-full overflow-hidden">
        <template v-if="selectedGroup">
          <Tabs default-value="account">
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
          <div class="flex justify-end mt-2" v-if="!isOwner">
            <span class="text-gray-500 text-sm">group by {{ ownerEmail }}</span>
          </div>
          <div class="flex justify-end" v-else>
            <Button variant="destructive" class="mt-4" @click="deleteGroup">
              <TrashIcon class="w-4 h-4 me-1" />
              Delete Group
            </Button>
          </div>
        </template>
        <div v-else class="flex justify-center items-center h-96">
          <p class="text-lg text-gray-500">Select a group to view details.</p>
        </div>
      </ScrollArea>
    </div>
  </div>
  <Dialog v-model:open="showDialog">
    <NewGroupDialog @close="showDialog = false" v-if="dialogType === 'create-group'" @created="created" />
    <GroupEditDialog @close="showDialog = false" v-if="dialogType === 'edit-group'" :group="selectedEditGroup" />
  </Dialog>
</template>

<style scoped></style>
