import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { CreateGroupRequest, Group } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useLocalUser } from '@/stores/localUser'
import { createItem } from '@directus/sdk'
import { getGroupsWithUserQuery } from '@/assets/ts/queries/group'
import type { GetGroupQueryResponse } from '@/assets/ts/queries/initial_data'

export const useGroups = defineStore('group', () => {
  const { setSelectedGroup, getSelectedGroup } = useLocalUser()
  const { fetchBookableObjectsByGroupId, fetchUserBookableObjects } = useBookableObjects()

  const groups = ref<Group[]>([])
  const selectedGroupId = ref<string | undefined>(getSelectedGroup() || undefined)

  const selectGroup = async (group: Group) => {
    setSelectedGroup(group.id as string)
    selectedGroupId.value = `${group.id}`
    if (group.id !== '-1') await fetchBookableObjectsByGroupId(group.id as string)
    else await fetchUserBookableObjects()
  }

  const setGroups = async (data: Group[]) => {
    groups.value = data

    const selected_group = getSelectedGroup()
    if (selected_group) {
      const group = groups.value.find((g) => g.id === selected_group)
      if (group) {
        await selectGroup(group)
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

  const fetchGroupsWithUser = async () => {
    const { client } = useUser()
    const result = await client.query<GetGroupQueryResponse>(getGroupsWithUserQuery({ as_query: false }))
    setGroups(result.group as Group[])
  }

  return { groups, selectedGroupId, selectedGroup, fetchGroupsWithUser, setGroups, addGroup, selectGroup, createGroup }
})
