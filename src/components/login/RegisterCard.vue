<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

import { useUser } from '@/stores/user'
import { useGlobalSettings } from '@/stores/globalSettings'
import type { CreateUserRequest } from '@/types'
import LogoImage from '@/components/bits/LogoImage.vue'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher.vue'

const { t } = useI18n()
const { displayLegal } = storeToRefs(useGlobalSettings())

const signupSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z
    .string()
    .email('Email must be valid')
    .min(1, { message: 'Email is required' }),
  legal: displayLegal.value
    ? z.boolean().refine((value) => value === true, {
        message: 'You must agree to the terms and conditions'
      })
    : z.boolean().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
    .regex(/[@$!%*?&#]/, {
      message: 'Password must contain at least one special character'
    })
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

const emit = defineEmits(['email-send'])
const loading = ref(false)

const onSubmit = async () => {
  const isValid = await validate()
  if (isValid.valid) {
    loading.value = true
    const { createUserRequest } = useUser()
    createUserRequest(getValues() as CreateUserRequest).then(() => {
      loading.value = false
      emit('email-send')
    })
  }
}
</script>

<template>
  <Card
    class="rounded-none h-full w-full sm:max-w-sm sm:h-auto sm:rounded-xl place-content-center"
  >
    <CardHeader class="max-w-sm m-auto">
      <CardTitle class="flex items-start justify-between">
        <div class="flex items-center gap-4 mb-3">
          <LogoImage />
          <div class="text-3xl font-bold">
            <div>BookiTool</div>
            <div class="text-2xl font-normal text-muted-foreground">
              {{ t('register.title') }}
            </div>
          </div>
        </div>
        <LanguageSwitcher variant="ghost" :flagSize="20" />
      </CardTitle>
      <CardDescription>
        {{ t('register.description') }}
      </CardDescription>
    </CardHeader>
    <CardContent class="max-w-sm m-auto">
      <form @submit.prevent="onSubmit" class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField name="first_name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="first-name"
                >{{ t('register.firstName') }}*</FormLabel
              >
              <FormControl class="col-span-3">
                <Input id="first-name" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="last_name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel for="last-name"
                >{{ t('register.lastName') }}*</FormLabel
              >
              <FormControl class="col-span-3">
                <Input id="last-name" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormLabel for="email">{{ t('register.email') }}</FormLabel>
            <FormControl class="col-span-3">
              <Input id="email" type="email" v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="password" v-slot="{ componentField }">
          <FormItem>
            <FormLabel for="password">{{ t('register.password') }}</FormLabel>
            <FormControl class="col-span-3">
              <Input id="password" type="password" v-bind="componentField" />
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
        <div v-show="displayLegal">
          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="legal"
          >
            <FormItem
              class="flex flex-row items-start gap-x-3 space-y-0 rounded-md"
            >
              <FormControl>
                <Checkbox
                  :model-value="value"
                  @update:model-value="handleChange"
                />
              </FormControl>
              <div class="space-y-1 leading-none">
                <FormLabel>{{ t('register.legal.agree') }}</FormLabel>
                <FormDescription>
                  {{ t('register.legal.description') }}
                  <router-link to="/terms-of-service" class="underline">
                    {{ t('register.legal.termsOfService') }}
                  </router-link>
                  {{ t('register.legal.and') }}
                  <router-link to="/privacy" class="underline">
                    {{ t('register.legal.privacyPolicy') }}
                  </router-link>
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
        </div>
        <Button type="submit" class="w-full mt-3" :loading="loading">
          {{ t('register.createAccount') }}
        </Button>
      </form>
      <div class="mt-4 text-center text-sm max-w-sm m-auto">
        {{ t('register.haveAccount') }}
        <router-link to="/login" class="underline">
          {{ t('register.signIn') }}
        </router-link>
      </div>
    </CardContent>
  </Card>
</template>
