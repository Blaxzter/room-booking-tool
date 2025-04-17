<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { SendIcon, TrashIcon } from 'lucide-vue-next'
import _ from 'lodash'
import { useMediaQuery } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

import type { Group, GroupDirectusUser, GroupInvite, User } from '@/types'

import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

import GroupRoleDropDown from '@/components/groups/utils/GroupRoleDropDown.vue'

import { useGroups } from '@/stores/groups'
import { useUser } from '@/stores/user'
import type { ShowAlertFunction } from '@/plugins/alert-dialog-plugin'

const { user } = storeToRefs(useUser())
const { t } = useI18n()

const backendUrl = inject('backendUrl')

const props = defineProps<{
  group: Group | undefined
}>()

const users = computed(() => {
  if (!props.group) {
    return []
  }
  // filter out the owner of the group
  return _.filter(
    props.group.users,
    (u) => (u.directus_users_id as User).id !== (props.group?.owner as { id: string })?.id
  )
})

const invites = computed(() => {
  if (!props.group) {
    return []
  }
  return props.group.invites
})

const userRole = computed(() => {
  if (!props.group || !user.value.id) {
    return ''
  }
  const groupUser = _.find(
    props.group.users,
    (u) => (u.directus_users_id as User).id === user.value.id
  )! as GroupDirectusUser
  return groupUser?.role
})

const isDisabled = computed(() => {
  return props.group !== undefined && userRole.value !== 'admin'
})

const inviteRole = ref<'member' | 'admin' | 'viewer'>('member')
const inviteEmail = ref('')

const sendInvite = () => {
  if (!props.group) {
    return
  }

  const { addInvite } = useGroups()
  addInvite(props.group, {
    email: inviteEmail.value,
    role: inviteRole.value
  })
}

const deleteInvite = async (invite: GroupInvite) => {
  if (!props.group) {
    return
  }

  const { deleteInvite } = useGroups()
  await deleteInvite(props.group, invite.id, false)
}

const getUser = (user: GroupDirectusUser) => {
  return user.directus_users_id as User
}

const getUserAvatar = (user: GroupDirectusUser) => {
  const avatar = getUser(user)?.avatar
  if (!avatar) {
    return ''
  }
  // check if avatar is string or object -> if object, get id
  if (typeof avatar === 'object') {
    return avatar.id
  }
  return avatar
}

const getUserInitials = (user: GroupDirectusUser) => {
  const u = getUser(user)
  if (!u) {
    return ''
  }
  if (!u.first_name || !u.last_name) {
    return u.email?.charAt(0) + u.email?.charAt(1)
  }
  return u.first_name?.charAt(0) + u.last_name?.charAt(0)
}

const updateUserRole = async (user: GroupDirectusUser, role: string) => {
  if (!props.group || !user.id) {
    return
  }

  const { updateGroupUser } = useGroups()
  await updateGroupUser(user.id, role).then(() => {
    const { toast } = useToast()
    toast({
      title: t('groups.bodys.groupMemberBody.toast.roleUpdated.title'),
      description: t('groups.bodys.groupMemberBody.toast.roleUpdated.description', { role }),
      variant: 'success'
    })
  })
}

const showAlertDialog = inject('showAlertDialog') as ShowAlertFunction
const deleteUser = async (user: GroupDirectusUser) => {
  if (!props.group || !user.id) {
    return
  }

  showAlertDialog({
    title: t('groups.bodys.groupMemberBody.deleteUser.title'),
    description: t('groups.bodys.groupMemberBody.deleteUser.description', { 
      email: getUser(user).email, 
      groupName: props.group.name 
    }),
    onConfirm: () => {
      const { deleteGroupUser } = useGroups()
      deleteGroupUser(user.id!).then(() => {
        const { toast } = useToast()
        toast({
          title: t('groups.bodys.groupMemberBody.toast.userRemoved.title'),
          description: t('groups.bodys.groupMemberBody.toast.userRemoved.description'),
          variant: 'success'
        })
      })
    },
    confirmIcon: TrashIcon,
    confirmVariant: 'destructive',
    onConfirmText: t('common.delete')
  })
}

const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <div class="grid gap-6">
    <div class="flex flex-col gap-2 items-stretch md:justify-between md:flex-row" v-if="!isDisabled">
      <Input type="email" :placeholder="t('groups.bodys.groupMemberBody.emailPlaceholder')" v-model="inviteEmail" />
      <GroupRoleDropDown v-model:role="inviteRole" class="flex-grow" />
      <Button
        variant="secondary"
        :size="isDesktop ? 'icon' : 'default'"
        class="flex-shrink-0 flex-grow"
        @click="sendInvite"
      >
        <span class="inline md:hidden">{{ t('groups.bodys.groupMemberBody.sendInvite') }}</span>
        <SendIcon class="h-5 w-5 ms-2 md:ms-0" />
      </Button>
    </div>
    <div v-if="users.length !== 0">
      <p class="text-sm text-muted-foreground">{{ t('groups.bodys.groupMemberBody.teamMembers') }}</p>
    </div>
    <div class="flex items-center justify-between space-x-4" v-for="c_user in users" :key="c_user.id">
      <div class="flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            :src="`${backendUrl}/assets/${getUserAvatar(c_user)}`"
            :alt="`${getUser(c_user)?.first_name} Avatar`"
          />
          <AvatarFallback>{{ getUserInitials(c_user) }}</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium leading-none">
            {{ getUser(c_user)?.first_name }} {{ getUser(c_user)?.last_name
            }}{{ getUser(c_user).id === user.id ? ` (${t('groups.bodys.groupMemberBody.you')})` : '' }}
          </p>
          <p class="text-sm text-muted-foreground">{{ getUser(c_user)?.email }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <GroupRoleDropDown
          :role="c_user?.role"
          @update:role="($event) => updateUserRole(c_user, $event)"
          :disabled="isDisabled"
        />
        <Button variant="secondary" size="icon" class="flex-shrink-0" @click="deleteUser(c_user)" v-if="!isDisabled">
          <TrashIcon class="h-5 w-5" />
        </Button>
      </div>
    </div>
    <div v-if="invites?.length !== 0">
      <p class="text-sm text-muted-foreground">{{ t('groups.bodys.groupMemberBody.invites') }}</p>
    </div>
    <div class="flex items-center justify-between space-x-4" v-for="invite in invites" :key="invite.id">
      <div class="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{{ invite.email.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div>
          <p class="text-sm font-medium leading-none">{{ invite.email }}</p>
          <p class="text-sm text-muted-foreground">{{ t('groups.bodys.groupMemberBody.invited') }}</p>
        </div>
      </div>
      <Button variant="secondary" size="icon" class="flex-shrink-0" @click="deleteInvite(invite)">
        <TrashIcon class="h-5 w-5" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
