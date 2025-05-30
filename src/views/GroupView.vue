<script setup lang="ts">
import _ from 'lodash'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { TrashIcon, ArrowLeftIcon, PlusCircleIcon } from 'lucide-vue-next'
import { useMediaQuery } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import type { Group, User } from '@/types'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Drawer } from '@/components/ui/drawer'

import CalenderLoader from '@/components/animations/CalenderLoader.vue'
import GroupList from '@/components/groups/GroupList.vue'
import GroupMemberCard from '@/components/groups/cards/GroupMemberCard.vue'
import GroupDataCard from '@/components/groups/cards/GroupDataCard.vue'
import NewGroupDialog from '@/components/groups/dialogs/NewGroupDialog.vue'
import GroupEditDialog from '@/components/groups/dialogs/GroupMemberDialog.vue'

import { useInitialDataStore } from '@/stores/initial'
import { useGroups } from '@/stores/groups'
import { useUser } from '@/stores/user'
import { useDialogStore } from '@/stores/dialog'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const { t } = useI18n()
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

const dialogStore = useDialogStore()

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

  dialogStore.show({
    title: t('groups.groupView.deleteGroup.title'),
    message: t('groups.groupView.deleteGroup.description', { name: selectedGroup.value.name }),
    confirmText: t('common.delete'),
    type: 'error',
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirm: async () => {
      if (!selectedGroup.value) {
        return
      }
      const { deleteGroup } = useGroups()
      await deleteGroup(selectedGroup.value.id)
      selectedGroup.value = undefined
    }
  })
}

const isOwner = computed(() => {
  return (selectedGroup?.value?.owner as { id: string })?.id === user.value.id
})

const ownerEmail = computed(() => {
  if (!selectedGroup.value) {
    return ''
  }
  return (
    _.find(
      selectedGroup.value.users,
      (u) => (u.directus_users_id as User).id === (selectedGroup.value?.owner as { id: string })?.id
    )?.directus_users_id as User
  )?.email
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const mobile = breakpoints.smallerOrEqual('lg')
const isDesktop = useMediaQuery('(min-width: 768px)')
const groupViewOpen = ref(false)
</script>

<template>
  <div class="container pt-5 mx-auto h-full max-h-full overflow-hidden">
    <CalenderLoader :height="150" v-if="init_loading" />
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch h-full max-h-full overflow-hidden">
        <ScrollArea v-if="!mobile || !groupViewOpen">
          <div class="mb-5 me-[-6px] pe-[6px] sm:me-[-12px] sm:pe-[12px] max-w-full">
            <GroupList
              @select-group="
                ($event) => {
                  selectedGroup = $event
                  groupViewOpen = true
                }
              "
              class="mb-2 max-w-full"
            />
            <div
              class="flex rounded-lg border p-3 transition-all hover:border-indigo-500/50 cursor-pointer h-[66px] sm:h-[98px] items-center justify-center text-gray-500 hover:text-indigo-500"
              @click="() => (showDialog = true)"
            >
              <div class="flex items-center gap-2">
                <PlusCircleIcon class="w-6 h-6" />
                {{ t('groups.groupView.addGroup') }}
              </div>
            </div>
          </div>
        </ScrollArea>
        <ScrollArea class="max-h-full overflow-hidden" v-if="!mobile || groupViewOpen">
          <template v-if="selectedGroup">
            <Tabs default-value="account">
              <div class="flex justify-between">
                <TabsList>
                  <TabsTrigger value="account"> {{ t('groups.groupView.tabs.groupInformation') }} </TabsTrigger>
                  <TabsTrigger value="password"> {{ t('groups.groupView.tabs.members') }} </TabsTrigger>
                </TabsList>
                <!-- back button -->
                <Button variant="ghost" class="text-gray-500" @click="groupViewOpen = false" v-if="mobile">
                  <ArrowLeftIcon class="w-4 h-4 me-1" /> {{ t('groups.groupView.back') }}
                </Button>
              </div>
              <TabsContent value="account">
                <GroupDataCard :group="selectedGroup" />
              </TabsContent>
              <TabsContent value="password">
                <GroupMemberCard :group="selectedGroup" />
              </TabsContent>
            </Tabs>
            <div class="flex justify-end mt-2" v-if="!isOwner">
              <span class="text-gray-500 text-sm">{{ t('groups.groupView.groupBy', { email: ownerEmail }) }}</span>
            </div>
            <div class="flex justify-end" v-else>
              <Button variant="destructive" class="mt-4" @click="deleteGroup">
                <TrashIcon class="w-4 h-4 me-1" />
                {{ t('groups.groupView.deleteButton') }}
              </Button>
            </div>
          </template>
          <div v-else class="flex justify-center items-center h-96">
            <p class="text-lg text-gray-500">{{ t('groups.groupView.selectGroup') }}</p>
          </div>
        </ScrollArea>
      </div>
    </template>
  </div>

  <Dialog v-model:open="showDialog" v-if="isDesktop || dialogType === 'edit-group'">
    <NewGroupDialog
      @close="showDialog = false"
      v-if="dialogType === 'create-group'"
      @created="created"
      :show-dialog="true"
    />
    <GroupEditDialog @close="showDialog = false" v-if="dialogType === 'edit-group'" :group="selectedEditGroup" />
  </Dialog>

  <Drawer v-model:open="showDialog" v-else>
    <NewGroupDialog
      @close="showDialog = false"
      v-if="dialogType === 'create-group'"
      @created="created"
      :show-dialog="false"
    />
  </Drawer>
</template>

<style scoped></style>
