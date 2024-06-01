<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { useUser } from '@/stores/user'

import { Input } from '@/components/ui/input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import { storeToRefs } from 'pinia'
import type { UpdateUserRequest } from '@/types'

const { toast } = useToast()
const { updateUserData } = useUser()
const { user } = storeToRefs(useUser())

const profileFormSchema = toTypedSchema(
  z.object({
    avatar: z.string().optional(),
    display_name: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      }),
    first_name: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      }),
    last_name: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      }),
    email: z
      .string({
        required_error: 'Please select an email to display.'
      })
      .email()
  })
)

const { handleSubmit } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    avatar: user.value?.avatar ?? '',
    email: user.value?.email ?? '',
    first_name: user.value?.first_name ?? '',
    last_name: user.value?.last_name ?? '',
    display_name: user.value?.display_name ?? user.value?.first_name + ' ' + user.value?.last_name ?? ''
  }
})

const avatarUpload = ref()
const avatarChanged = ref(false)

const onSubmit = handleSubmit(async (values) => {
  console.log(avatarUpload.value, avatarChanged)
  if (avatarUpload.value && avatarChanged.value) {
    const avatar = await avatarUpload.value.uploadImage()
    if (avatar) {
      values.avatar = avatar
    }
  }
  await updateUserData(values as UpdateUserRequest).then(
    () => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success'
      })
    },
    (error) => {
      toast({
        title: 'Profile update failed',
        description: error.message,
        variant: 'destructive'
      })
    }
  )
})
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <div class="grid gap-4">
      <Label>Display Image</Label>
      <AvatarUploadComponent
        ref="avatarUpload"
        :height="6"
        alignment="left"
        class="ms-2"
        folder="b9b3ad18-3da4-42e3-8cdc-dc749ce89041"
        :initAvatar="user.avatar"
        @avatar-updated="avatarChanged = true"
      />
      <div class="text-sm text-muted-foreground">Upload a new image to change your profile picture.</div>
    </div>

    <FormField v-slot="{ componentField }" name="display_name">
      <FormItem>
        <FormLabel>Displayname</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Display Name" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is the name that will be displayed publicly when you approve a booking.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your email address" v-bind="componentField" />
        </FormControl>
        <FormDescription> This is the email address that will be displayed on your profile. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-4">
      <div class="flex-grow">
        <FormField v-slot="{ componentField }" name="first_name" class="flex-grow">
          <FormItem>
            <FormLabel>Firstname</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Firstname" v-bind="componentField" />
            </FormControl>
            <FormDescription> Your first name. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="flex-grow">
        <FormField v-slot="{ componentField }" name="last_name" class="flex-grow">
          <FormItem>
            <FormLabel>Lastname</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Lastname" v-bind="componentField" />
            </FormControl>
            <FormDescription> Your last name. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <div class="flex gap-2 justify-start">
      <Button type="submit"> Update profile </Button>
    </div>
  </form>
</template>
