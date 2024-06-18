<script setup lang="ts">
import { useUser } from '@/stores/user'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { CreateUserRequest } from '@/types'

const signupSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email('Email must be valid').min(1, { message: 'Email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character' })
})

const { values, validate } = useForm({
  validationSchema: toTypedSchema(signupSchema),
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  }
})

const getValues = () => {
  return { ...values }
}
const onSubmit = async () => {
  const isValid = await validate()
  if (isValid.valid) {
    const { createUserRequest } = useUser()
    createUserRequest(getValues() as CreateUserRequest)
  }
}
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription> Enter your information to create an account </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit" class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField name="first_name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="first-name">First name</FormLabel>
              <FormControl class="col-span-3">
                <Input id="first-name" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="last_name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="last-name">Last name</FormLabel>
              <FormControl class="col-span-3">
                <Input id="last-name" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormLabel for="email">Email</FormLabel>
            <FormControl class="col-span-3">
              <Input id="email" type="email" v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="password" v-slot="{ componentField }">
          <FormItem>
            <FormLabel for="password">Password</FormLabel>
            <FormControl class="col-span-3">
              <Input id="password" type="password" v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="w-full mt-3"> Create an account </Button>
      </form>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <router-link to="/login" class="underline"> Sign in </router-link>
      </div>
    </CardContent>
  </Card>
</template>
