import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import _ from 'lodash'

import type { CreateGroupRequest, Group, InviteRequest } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useLocalUser } from '@/stores/localUser'
import { createItem, updateItem } from '@directus/sdk'
import { getGroupsWithUserQuery } from '@/assets/ts/queries/group'
import type { GetGroupQueryResponse } from '@/assets/ts/queries/initial_data'

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
    addGroup(result as Group)
    return result
  }

  const fetchGroupsWithData = async (with_bookable_objects = true) => {
    const { client } = useUser()
    const result = await client.query<GetGroupQueryResponse>(
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

  const addInvite = async (group_id: string, inviteRequest: InviteRequest) => {
    // This is a patch request on http://localhost:8055/items/group/1
    const { client } = useUser()
    return await client.request(updateItem('group', group_id, inviteRequest))
  }

  return {
    groups,
    selectedGroupId,
    selectedGroup,
    fetchGroupsWithData,
    setGroups,
    addGroup,
    selectGroup,
    createGroup,
    reset,
    addInvite
  }
})
