import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import _ from 'lodash'

import type { CreateGroupRequest, Group, GroupInvite, InviteCreateRequest } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useLocalUser } from '@/stores/localUser'
import { createItem, updateItem, deleteItem } from '@directus/sdk'
import { getGroupsWithUserQuery } from '@/assets/ts/queries/group'
import type {
  GetGroupQueryResponse,
  GetGroupsQueryResponse,
  GetInviteQueryResponse
} from '@/assets/ts/queries/initial_data'
import { getInviteQuery } from '@/assets/ts/queries/invites'

export const useGroups = defineStore('group', () => {
  const { setSelectedGroup, getSelectedGroup } = useLocalUser()
  const { fetchBookableObjectsByGroupId, fetchUserBookableObjects } = useBookableObjects()

  const groups = ref<Group[]>([])
  const selectedGroupId = ref<string | undefined>(getSelectedGroup() || undefined)

  const reset = () => {
    groups.value = []
    selectedGroupId.value = undefined
  }

  const selectGroup = async (group: Group, fetchBookableObjects: boolean = true) => {
    setSelectedGroup(group.id as string)
    selectedGroupId.value = `${group.id}`
    if (fetchBookableObjects) {
      if (group.id !== '-1') await fetchBookableObjectsByGroupId(group.id as string)
      else await fetchUserBookableObjects()
    }
  }

  const setGroups = async (data: Group[], fetchBookableObjects: boolean = true) => {
    groups.value = data

    const selected_group = getSelectedGroup()
    if (selected_group) {
      const group = groups.value.find((g) => g.id === selected_group)
      if (group) {
        await selectGroup(group, fetchBookableObjects)
      }
    }
  }

  const addGroup = (group: Group) => {
    groups.value.push(group)
  }

  const selectedGroup = computed(() => groups.value.find((g) => g.id === selectedGroupId.value) as Group | undefined)

  const createGroup = async (group: CreateGroupRequest) => {
    const { client } = useUser()
    const { user } = storeToRefs(useUser())

    group.owner = user.value.id
    group.users = [
      {
        directus_users_id: user.value.id,
        role: 'admin'
      }
    ]
    const result = await client.request(createItem('group', group))
    // cast result to Group
    const newGroupWithData = await fetchGroupWithData(result.id)
    addGroup(newGroupWithData!)
    return newGroupWithData
  }

  const fetchGroupWithData = async (group_id: string, with_bookable_objects = true) => {
    const { client } = useUser()
    const result = await client.query<GetGroupQueryResponse>(
      getGroupsWithUserQuery({ as_query: true, with_bookable_objects, group_id })
    )
    const groups = result.group as Group[]
    // get the first group
    if (!groups[0]) return
    const group = groups[0]
    if (!_.isNil(result.bookable_object))
      for (const bookable_object of result.bookable_object) {
        if (!group.objects) {
          group.objects = []
        }
        group.objects.push(bookable_object)
      }
    return group
  }

  const fetchGroupsWithData = async (with_bookable_objects = true) => {
    const { client } = useUser()
    const result = await client.query<GetGroupsQueryResponse>(
      getGroupsWithUserQuery({ as_query: true, with_bookable_objects })
    )
    const groups = result.group as Group[]
    if (!_.isNil(result.bookable_object))
      for (const bookable_object of result.bookable_object) {
        console.log(bookable_object)
        const group = groups.find((group) =>
          _.find(bookable_object.group as { group_id: Group }[], (g) => g.group_id.id === group?.id)
        )
        console.log(group)
        if (group) {
          if (!group.objects) {
            group.objects = []
          }
          group.objects.push(bookable_object)
        }
      }
    await setGroups(groups, false)
    return groups
  }

  const getInvites = async (user_id: string) => {
    const { client } = useUser()
    const result = await client.query<GetInviteQueryResponse>(getInviteQuery({ as_query: true, user_id }))
    return result.group_invites
  }

  const addInvite = async (group: Group, inviteRequest: InviteCreateRequest) => {
    const { client } = useUser()
    const newInvite = await client.request(createItem('group_invites', { group_id: group.id, ...inviteRequest }))
    group.invites?.push(newInvite as GroupInvite)
    return newInvite
  }

  const deleteInvite = async (group: Group, invite_id: string, reject: boolean) => {
    const { client } = useUser()
    return await client.request(deleteItem('group_invites', invite_id)).then(() => {
      if (reject) groups.value = groups.value.filter((g) => g.id !== group.id)
      else {
        console.log('deleteInvite', group.invites)
        const index = group.invites?.findIndex((invite) => invite.id === invite_id)
        if (index !== undefined && index !== -1) {
          group.invites?.splice(index, 1)
        }
      }
    })
  }

  const deleteGroup = async (group_id: string) => {
    const { client } = useUser()
    return await client.request(deleteItem('group', group_id)).then(() => {
      groups.value = groups.value.filter((group) => group.id !== group_id)
    })
  }

  const deleteGroupUser = async (id: string) => {
    const { client } = useUser()
    return await client.request(deleteItem('group_directus_users', id)).then(() => {
      const group = groups.value.find((g) => g.id === selectedGroupId.value)
      if (group) {
        group.users = group.users?.filter((user) => user.id !== id)
      }
    })
  }

  const updateGroupUser = async (id: string, role: string) => {
    const { client } = useUser()
    return await client.request(updateItem('group_directus_users', id, { role }))
  }

  const addGroupUser = async (group_id: string, user_id: string, role: string) => {
    const { client } = useUser()
    // call remove user from group
    return await client.request(createItem('group_directus_users', { group_id, directus_users_id: user_id, role }))
  }

  const updateGroup = async (group_id: string, data: Partial<Group>) => {
    const { client } = useUser()
    // Do not send update to backend if data is avatar: { id: undefined }
    if (!(Object.keys(data).length === 1 && Object.keys(data)[0] === 'avatar' && data.avatar?.id === undefined)) {
      console.log('updateItem')
      await client.request(updateItem('group', group_id, data))
    }
    const group = groups.value.find((g) => g.id === group_id)
    console.log(group)
    if (group) {
      Object.assign(group, data)
    }
    console.log(group)
    return group
  }

  return {
    groups,
    selectedGroupId,
    selectedGroup,
    fetchGroupWithData,
    fetchGroupsWithData,
    setGroups,
    addGroup,
    selectGroup,
    createGroup,
    reset,
    getInvites,
    addInvite,
    deleteInvite,
    deleteGroupUser,
    deleteGroup,
    updateGroupUser,
    addGroupUser,
    updateGroup
  }
})
