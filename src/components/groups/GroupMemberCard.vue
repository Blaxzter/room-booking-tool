<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { SendIcon } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import GroupRoleDropDown from '@/components/groups/GroupRoleDropDown.vue'
import { Button } from '@/components/ui/button'
import type { Group } from '@/types'
import { useGroups } from '@/stores/groups'

const props = defineProps<{
  group: Group | undefined
}>()

const sofiaRole = ref('Owner')
const jacksonRole = ref('Member')

const inviteRole = ref<'member' | 'admin' | 'viewer'>('member')
const inviteEmail = ref('')

const sendInvite = () => {
  if (!props.group) {
    return
  }

  const { addInvite } = useGroups()
  addInvite(props.group.id, {
    invites: [
      {
        email: inviteEmail.value,
        role: inviteRole.value
      }
    ]
  })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Team Members</CardTitle>
      <CardDescription> Invite your team members to collaborate. </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-6">
        <div class="flex items-center justify-between space-x-4">
          <Input type="email" placeholder="Email" v-model="inviteEmail" />
          <GroupRoleDropDown v-model:role="inviteRole" />
          <Button variant="secondary" size="icon" class="flex-shrink-0" @click="sendInvite">
            <SendIcon class="h-5 w-5" />
          </Button>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Team members</p>
        </div>
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium leading-none">Sofia Davis</p>
              <p class="text-sm text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <GroupRoleDropDown :role="sofiaRole" />
        </div>
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/02.png" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium leading-none">Jackson Lee</p>
              <p class="text-sm text-muted-foreground">p@example.com</p>
            </div>
          </div>
          <GroupRoleDropDown :role="jacksonRole" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped></style>
