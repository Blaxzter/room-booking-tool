<script setup lang="ts">
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

import { randomGroupName } from '@/assets/ts/constants'
import { useGroups } from '@/stores/groups'

import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import EmojiPicker from '@/components/utils/EmojiPicker.vue'

const { toast } = useToast()

const emit = defineEmits(['close', 'created'])

const selectedEmoji = ref<string | undefined>(undefined)
const avatarUpload = ref()

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

const { handleSubmit } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {}
})

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
    description: `The group ${newGroup.name} has been created.`
  })
  emit('created', newGroup)
})
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create group</DialogTitle>
      <DialogDescription> Add a new group to manage rooms and other bookable objects. </DialogDescription>
    </DialogHeader>
    <form class="space-y-4" @submit="onSubmit">
      <div class="space-y-2">
        <Label for="name">Group Image</Label>
        <div class="flex items-center justify-center">
          <div class="mt-1 flex flex-col items-center w-[120px]">
            <AvatarUploadComponent ref="avatarUpload" />
            <div class="text-sm text-gray-500 mt-3">Upload an Image</div>
          </div>

          <div class="mx-1 sm:mx-5 mb-7">or</div>

          <div class="flex flex-col items-center w-[120px]">
            <EmojiPicker v-model="selectedEmoji" />
            <div class="text-sm text-gray-500 mt-3">Select an Emoji</div>
          </div>
        </div>
      </div>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Group name</FormLabel>
          <FormControl>
            <Input type="text" :placeholder="randomGroupName()" v-bind="componentField" />
          </FormControl>
          <FormDescription> This is the name of the group that will be displayed to users. </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea placeholder="A short description of the group" v-bind="componentField" />
          </FormControl>
          <FormDescription> This is a short description of the group that will be displayed to users. </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <DialogFooter>
        <Button variant="outline" @click="emit('close')"> Cancel </Button>
        <Button type="submit" class="mb-2 sm:mb-0"> Continue </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</template>

<style>
@import 'emoji-mart-vue-fast/css/emoji-mart.css';
</style>
