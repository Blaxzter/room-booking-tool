import { computed, ref, type Ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import type { BookableObject, CreateGroupRequest, Group, GroupInvite, InviteCreateRequest } from '@/types'
import { useBookableObjects } from '@/stores/bookableObjects'
import { useUser } from '@/stores/user'
import { useLocalUser } from '@/stores/localUser'
import { createItem, deleteItem, updateItem } from '@directus/sdk'
import { getGroupsWithUserQuery } from '@/assets/ts/queries/group'
import type {
  GetGroupQueryResponse,
  GetGroupsQueryResponse,
  GetInviteQueryResponse
} from '@/assets/ts/queries/initial_data'
import { getInviteQuery } from '@/assets/ts/queries/invites'
import { toast } from '@/components/ui/toast'

interface GroupStore {
  groups: Ref<Group[]>
  selectedGroupId: Ref<string | undefined>
  selectedGroup: Ref<Group | undefined>
  fetchGroupWithData: (group_id: string, with_bookable_objects?: boolean) => Promise<Group | undefined>
  fetchGroupsWithData: (with_bookable_objects?: boolean) => Promise<Group[]>
  setGroups: (data: Group[], fetchBookableObjects?: boolean) => Promise<void>
  addGroup: (group: Group) => void
  selectGroup: (group: Group, fetchBookableObjects?: boolean) => Promise<void>
  createGroup: (group: CreateGroupRequest) => Promise<Group | undefined>
  reset: () => void
  getInvites: (user_id: string) => Promise<GroupInvite[]>
  addInvite: (group: Group, inviteRequest: InviteCreateRequest) => Promise<GroupInvite>
  deleteInvite: (group: Group, invite_id: string, reject: boolean) => Promise<void>
  deleteGroupUser: (id: string) => Promise<void>
  deleteGroup: (group_id: string) => Promise<void>
  deleteAvatar: (group: Group) => Promise<void>
  updateGroupUser: (id: string, role: string) => Promise<any>
  addGroupUser: (group_id: string, user_id: string, role: string) => Promise<any>
  updateGroup: (group_id: string, data: Partial<Group>) => Promise<Group | undefined>
  addBookableObjectToGroup: (group_id: string, bookable_object: BookableObject) => Promise<void>
  getUserRoleByBookableObject: (bookable_object?: BookableObject) => number
}

export const useGroups = defineStore('group', (): GroupStore  => {
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

    let result
    try {
      result = await client.request(createItem('group', group))
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error creating bookable object',
        description: error?.errors?.[0]?.message,
        variant: 'destructive'
      })
      throw error
    }

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
    return group
  }

  const fetchGroupsWithData = async (with_bookable_objects = true) => {
    const { client } = useUser()
    const result = await client.query<GetGroupsQueryResponse>(
      getGroupsWithUserQuery({ as_query: true, with_bookable_objects })
    )
    const groups = result.group as Group[]
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
    return newInvite as GroupInvite
  }

  const deleteInvite = async (group: Group, invite_id: string, reject: boolean) => {
    const { client } = useUser()
    return await client.request(deleteItem('group_invites', invite_id)).then(() => {
      if (reject) groups.value = groups.value.filter((g) => g.id !== group.id)
      else {
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
      await client.request(updateItem('group', group_id, data))
    }
    const group = groups.value.find((g) => g.id === group_id)
    if (group) {
      Object.assign(group, data)
    }
    return group
  }

  const getUserRoleByBookableObject = (bookable_object: BookableObject | undefined) => {
    if (!bookable_object) {
      const { selectedBookableObject } = storeToRefs(useBookableObjects())
      bookable_object = selectedBookableObject.value as BookableObject
    }

    const { user } = storeToRefs(useUser())

    if (user.value?.id === bookable_object.owner || user.value?.id === (bookable_object.owner as { id: string })?.id)
      return 4

    // get all groups that have the bookable object
    const relevantGroups = groups.value.filter((group) => {
      return group.bookable_objects?.find((object) => object.bookable_object_id.id === bookable_object.id)
    })

    let retRole = 1
    // get the highest role
    for (const group of relevantGroups) {
      for (const group_user of group.users || []) {
        if (group_user.role === 'admin') return 3

        if (group_user.role === 'member') retRole = 2
      }
    }
    return retRole
  }

  const addBookableObjectToGroup = async (group_id: string, bookable_object: BookableObject) => {
    const group = groups.value.find((g) => g.id === group_id)
    if (!group) {
      return
    }

    if (group.bookable_objects?.find((obj) => obj.bookable_object_id.id === bookable_object.id)) {
      return
    }

    group.bookable_objects?.push({ bookable_object_id: bookable_object })
  }

  const deleteAvatar = async (group: Group) => {
    if (!group.avatar) {
      return
    }

    const { deleteDirectusFile, client } = useUser()
    return await client.request(updateItem('group', group.id, { avatar: null })).then(async () => {
      await deleteDirectusFile(group.avatar!.id)
    })
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
    deleteAvatar,
    updateGroupUser,
    addGroupUser,
    updateGroup,
    addBookableObjectToGroup,
    getUserRoleByBookableObject
  }
})
