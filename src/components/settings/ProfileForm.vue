<script setup lang="ts">
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Input } from '@/components/ui/input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { Label } from '@/components/ui/label'
import AvatarUploadComponent from '@/components/utils/AvatarUploadComponent.vue'

const profileFormSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      }),
    firstname: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.'
      })
      .max(30, {
        message: 'Username must not be longer than 30 characters.'
      }),
    lastname: z
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
      .email(),
    bio: z
      .string()
      .max(160, { message: 'Bio must not be longer than 160 characters.' })
      .min(4, { message: 'Bio must be at least 2 characters.' }),
    urls: z
      .array(
        z.object({
          value: z.string().url({ message: 'Please enter a valid URL.' })
        })
      )
      .optional()
  })
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    bio: 'I own a computer.',
    urls: [{ value: 'https://shadcn.com' }, { value: 'https://twitter.com/shadcn' }]
  }
})

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))
    )
  })
})

const toastTest = () => {
  toast({
    title: 'Toast Test',
    description: 'This is a test toast message.'
  })
}
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <div class="grid gap-4">
      <Label>Display Image</Label>
      <AvatarUploadComponent ref="avatarUpload" :height="6" alignment="left" class="ms-2" />
      <div class="text-sm text-muted-foreground">Upload an splash image.</div>
    </div>

    <FormField v-slot="{ componentField }" name="username">
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
        <FormField v-slot="{ componentField }" name="firstname" class="flex-grow">
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
        <FormField v-slot="{ componentField }" name="lastname" class="flex-grow">
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

      <Button type="button" variant="outline" @click="resetForm"> Reset form </Button>
    </div>
  </form>

  <Button type="button" @click="toastTest"> Toast Test </Button>
</template>
