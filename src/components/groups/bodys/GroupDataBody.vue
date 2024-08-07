<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

import { randomGroupName } from '@/assets/ts/constants'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'

import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import EmojiPicker from '@/components/utils/EmojiPicker.vue'
import { useGroups } from '@/stores/groups'
import type { Group, GroupDirectusUser, User } from '@/types'
import { useUser } from '@/stores/user'
const { user } = storeToRefs(useUser())

const { toast } = useToast()

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
        message: 'Group name must be at least 2 characters.'
      })
      .max(30, {
        message: 'Group name must not be longer than 30 characters.'
      }),
    description: z
      .string()
      .max(160, { message: 'Group description must not be longer than 160 characters.' })
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
    title: 'Group created',
    description: `The group ${newGroup?.name} has been created.`
  })
  emit('created', newGroup as Group)
})

// Function to update the group in the backend
const updateGroup = async (field: keyof Group, value: any) => {
  if (props.group && props.group[field] !== value) {
    const { updateGroup } = useGroups()
    await updateGroup(props.group.id, { [field]: value })
    toast({
      title: 'Group updated',
      description: `The group ${props.group.name} has been updated.`
    })
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
  return props.group !== undefined && userRole.value !== 'admin'
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <div class="space-y-2">
      <Label for="name">Group Image</Label>
      <div class="flex items-center justify-center">
        <div class="mt-1 flex flex-col items-center w-[120px]">
          <AvatarUploadComponent
            ref="avatarUpload"
            :initAvatar="group?.avatar?.id"
            @avatar-updated="updateGroup('avatar', $event)"
            @avatar-cleared="updateGroup('avatar', null)"
            :add-clear-request="!!group"
            :disabled="isDisabled"
          />
          <div class="text-sm text-gray-500 mt-3" v-if="!isDisabled">Upload an Image</div>
        </div>

        <div class="mx-1 sm:mx-5" :class="[!isDisabled ? 'mb-7' : 'mb-1']">or</div>

        <div class="flex flex-col items-center w-[120px]">
          <EmojiPicker v-model="selectedEmoji" @select="updateGroup('emoji', selectedEmoji)" :disabled="isDisabled" />
          <div class="text-sm text-gray-500 mt-3" v-if="!isDisabled">Select an Emoji</div>
        </div>
      </div>
    </div>
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Group name</FormLabel>
        <FormControl>
          <Input
            type="text"
            :placeholder="randomGroupName()"
            v-bind="componentField"
            @blur="updateGroup('name', values.name)"
            :disabled="isDisabled"
          />
        </FormControl>
        <FormDescription> This is the name of the group that will be displayed to users. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            placeholder="A short description of the group"
            v-bind="componentField"
            @blur="updateGroup('description', values.description)"
            :disabled="isDisabled"
          />
        </FormControl>
        <FormDescription> This is a short description of the group that will be displayed to users. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot />
  </form>
</template>

<style lang="scss">
@import '../../../../node_modules/emoji-mart-vue-fast/css/emoji-mart.css';
</style>
