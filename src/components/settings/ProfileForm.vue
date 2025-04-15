<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useI18n } from 'vue-i18n'

import { useUser } from '@/stores/user'
import { useGlobalSettings } from '@/stores/globalSettings'

import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast/use-toast'

import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'
import { storeToRefs } from 'pinia'
import type { UpdateUserRequest } from '@/types'

const { toast } = useToast()
const { updateUserData } = useUser()
const { user } = storeToRefs(useUser())
const { isDemoUser } = storeToRefs(useGlobalSettings())
const { t } = useI18n()

const profileFormSchema = toTypedSchema(
  z.object({
    avatar: z.string().optional(),
    display_name: z
      .string()
      .min(2, {
        message: t('settings.profile.validation.displayNameMin')
      })
      .max(30, {
        message: t('settings.profile.validation.displayNameMax')
      }),
    first_name: z
      .string()
      .min(2, {
        message: t('settings.profile.validation.firstNameMin')
      })
      .max(30, {
        message: t('settings.profile.validation.firstNameMax')
      }),
    last_name: z
      .string()
      .min(2, {
        message: t('settings.profile.validation.lastNameMin')
      })
      .max(30, {
        message: t('settings.profile.validation.lastNameMax')
      }),
    email: z
      .string({
        required_error: t('settings.profile.validation.emailRequired')
      })
      .email()
  })
)

const getAvatarString = (avatar: string | { id: string } | undefined) => {
  if (!avatar) {
    return ''
  }
  if (typeof avatar === 'string') {
    return avatar
  }
  return avatar.id
}

const { handleSubmit } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    avatar: getAvatarString(user.value?.avatar) ?? '',
    email: user.value?.email ?? '',
    first_name: user.value?.first_name ?? '',
    last_name: user.value?.last_name ?? '',
    display_name:
      user.value?.display_name ??
      user.value?.first_name + ' ' + user.value?.last_name ??
      ''
  }
})

const avatarUpload = ref()
const avatarChanged = ref(false)

const updateAvatar = async (values: any) => {
  if (isDemoUser.value) {
    toast({
      title: t('settings.demo.title'),
      description: t('settings.demo.avatarDisabled'),
      variant: 'destructive'
    })
    return values
  }

  if (avatarUpload.value && avatarChanged.value) {
    const avatar = await avatarUpload.value.uploadImage()
    if (avatar) {
      values.avatar = avatar
    }
  }
  return values
}

const onSubmit = handleSubmit(async (values) => {
  const updatedValues = await updateAvatar(values)

  await updateUserData(updatedValues as UpdateUserRequest).then(
    () => {
      toast({
        title: t('settings.profile.toast.success.title'),
        description: t('settings.profile.toast.success.description'),
        variant: 'success'
      })
    },
    (error) => {
      toast({
        title: t('settings.profile.toast.error.title'),
        description: error.message,
        variant: 'destructive'
      })
    }
  )
})
</script>

<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
    <div class="grid gap-4">
      <Label>{{ t('settings.profile.displayImage') }}</Label>
      <AvatarUploadComponent
        ref="avatarUpload"
        :height="6"
        alignment="left"
        class="ms-2"
        folder="b9b3ad18-3da4-42e3-8cdc-dc749ce89041"
        :initAvatar="getAvatarString(user.avatar)"
        @avatar-updated="avatarChanged = true"
        @avatar-cleared="avatarChanged = true"
        :disabled="isDemoUser"
      />
      <div class="text-sm text-muted-foreground">
        {{ t('settings.profile.uploadImageHelp') }}
      </div>
    </div>

    <FormField v-slot="{ componentField }" name="display_name">
      <FormItem>
        <FormLabel>{{ t('settings.profile.displayName') }}</FormLabel>
        <FormControl>
          <Input
            type="text"
            :placeholder="t('settings.profile.displayNamePlaceholder')"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          {{ t('settings.profile.displayNameHelp') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>{{ t('settings.profile.email') }}</FormLabel>
        <FormControl>
          <Input
            type="text"
            :placeholder="t('settings.profile.emailPlaceholder')"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          {{ t('settings.profile.emailHelp') }}
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-4">
      <div class="flex-grow">
        <FormField
          v-slot="{ componentField }"
          name="first_name"
          class="flex-grow"
        >
          <FormItem>
            <FormLabel>{{ t('settings.profile.firstName') }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                :placeholder="t('settings.profile.firstNamePlaceholder')"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription>{{ t('settings.profile.firstNameHelp') }}</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="flex-grow">
        <FormField
          v-slot="{ componentField }"
          name="last_name"
          class="flex-grow"
        >
          <FormItem>
            <FormLabel>{{ t('settings.profile.lastName') }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                :placeholder="t('settings.profile.lastNamePlaceholder')"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription>{{ t('settings.profile.lastNameHelp') }}</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <div class="flex gap-2 justify-start">
      <Button type="submit">{{ t('settings.profile.updateButton') }}</Button>
    </div>
  </form>
</template>
