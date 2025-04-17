<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

import { randomGroupName } from '@/assets/ts/constants'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'

import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import EmojiPicker from '@/components/utils/EmojiPicker.vue'
import { useGroups } from '@/stores/groups'
import type { Group, GroupDirectusUser, User } from '@/types'
import { useUser } from '@/stores/user'
import { useGlobalSettings } from '@/stores/globalSettings'
const { user } = storeToRefs(useUser())
const { isDemoUser } = storeToRefs(useGlobalSettings())

const { toast } = useToast()
const { t } = useI18n()

const emit = defineEmits(['close', 'created'])

const selectedEmoji = ref<string | undefined>(undefined)
const avatarUpload = ref()

const props = defineProps({
  group: {
    type: Object as () => Group | undefined,
    required: false
  },
  componentType: {
    type: String,
    required: false,
    default: 'create'
  }
})

const profileFormSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, {
        message: t('groups.bodys.groupDataBody.validation.nameMin')
      })
      .max(30, {
        message: t('groups.bodys.groupDataBody.validation.nameMax')
      }),
    description: z
      .string()
      .max(160, {
        message: t('groups.bodys.groupDataBody.validation.descriptionMax')
      })
      .optional(),
    emoji: z.string().optional(),
    avatar: z
      .object({
        id: z.string()
      })
      .optional()
  })
)

const { handleSubmit, setValues, values } = useForm({
  validationSchema: profileFormSchema,
  // get the initial values from the group prop
  initialValues: {
    name: props.group?.name || '',
    description: props.group?.description || '',
    emoji: props.group?.emoji || '',
    avatar: props.group?.avatar || { id: '' }
  }
})

// watch the props.group and set data
watch(
  () => props.group,
  (newGroup) => {
    setValues({
      name: newGroup?.name || '',
      description: newGroup?.description || '',
      emoji: newGroup?.emoji || '',
      avatar: newGroup?.avatar || { id: '' }
    })
    selectedEmoji.value = newGroup?.emoji
  },
  { deep: true, immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  const { createGroup } = useGroups()

  values.avatar = { id: await avatarUpload.value.uploadImage() }
  if (!values.avatar.id) {
    delete values.avatar
  }
  values.emoji = selectedEmoji.value
  const newGroup = await createGroup(values)
  toast({
    title: t('groups.bodys.groupDataBody.toast.created.title'),
    description: t('groups.bodys.groupDataBody.toast.created.description', { name: newGroup?.name })
  })
  emit('created', newGroup as Group)
})

// Function to update the group in the backend
const updateGroup = async (field: keyof Group, value: any) => {
  console.log('updateGroup', field, value)
  if (props.group && props.group[field] !== value) {
    const { updateGroup } = useGroups()
    await updateGroup(props.group.id, { [field]: value })
    toast({
      title: t('groups.bodys.groupDataBody.toast.updated.title'),
      description: t('groups.bodys.groupDataBody.toast.updated.description', { name: props.group.name })
    })
  }
}

const updateGroupAvatar = async (isDelete: boolean) => {
  if (props.group) {
    // delete old avatar
    if (isDelete) {
      const { deleteAvatar } = useGroups()
      await deleteAvatar(props.group)
    }
    if (!isDelete) {
      await updateGroup('avatar', {
        id: await avatarUpload.value.uploadImage()
      })
    }
  }
}

const userRole = computed(() => {
  if (!props.group || !user.value.id) {
    return undefined
  }
  const groupUser = _.find(
    props.group.users,
    (u) => (u.directus_users_id as User).id === user.value.id
  )! as GroupDirectusUser
  return groupUser?.role
})

const isDisabled = computed(() => {
  return (
    (props.group !== undefined && userRole.value !== 'admin') ||
    isDemoUser.value
  )
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <div class="space-y-2">
      <Label for="name">{{ t('groups.bodys.groupDataBody.groupImage') }}</Label>
      <div class="flex items-center justify-center">
        <div class="mt-1 flex flex-col items-center w-[120px]">
          <AvatarUploadComponent
            ref="avatarUpload"
            :initAvatar="group?.avatar?.id"
            @avatar-updated="updateGroupAvatar(false)"
            @avatar-cleared="updateGroupAvatar(true)"
            :add-clear-request="!!group"
            :disabled="isDisabled"
          />
          <div class="text-sm text-gray-500 mt-3" v-if="!isDisabled">
            {{ t('groups.bodys.groupDataBody.uploadImage') }}
          </div>
        </div>

        <div class="mx-1 sm:mx-5" :class="[!isDisabled ? 'mb-7' : 'mb-1']">
          {{ t('groups.bodys.groupDataBody.or') }}
        </div>

        <div class="flex flex-col items-center w-[120px]">
          <EmojiPicker
            v-model="selectedEmoji"
            @select="updateGroup('emoji', selectedEmoji)"
            :disabled="isDisabled"
          />
          <div class="text-sm text-gray-500 mt-3" v-if="!isDisabled">
            {{ t('groups.bodys.groupDataBody.selectEmoji') }}
          </div>
        </div>
      </div>
    </div>
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>{{ t('groups.bodys.groupDataBody.groupName') }}</FormLabel>
        <FormControl>
          <Input
            type="text"
            :placeholder="randomGroupName()"
            v-bind="componentField"
            @blur="updateGroup('name', values.name)"
            :disabled="isDisabled"
          />
        </FormControl>
        <FormDescription>
          {{ t('groups.bodys.groupDataBody.groupNameDescription') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>{{ t('groups.bodys.groupDataBody.description') }}</FormLabel>
        <FormControl>
          <Textarea
            :placeholder="t('groups.bodys.groupDataBody.descriptionPlaceholder')"
            v-bind="componentField"
            @blur="updateGroup('description', values.description)"
            :disabled="isDisabled"
          />
        </FormControl>
        <FormDescription>
          {{ t('groups.bodys.groupDataBody.descriptionDescription') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot />
  </form>
</template>

<style lang="scss">
@use '../../../../node_modules/emoji-mart-vue-fast/css/emoji-mart.css';
</style>
