<template>
  <form class="grid gap-5 py-4">
    <FormField name="description" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="description"> Description </FormLabel>
        <FormControl class="col-span-3">
          <Textarea id="description" v-bind="componentField" />
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4"> Describe the event you are booking </FormDescription>
      </FormItem>
    </FormField>
    <template v-if="displayLegal">
      <FormField v-slot="{ value, handleChange }" type="checkbox" name="legal">
        <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
          <FormControl>
            <Checkbox :checked="value" @update:checked="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>I agree to the terms and conditions</FormLabel>
            <FormDescription>
              By creating a booking, you agree to our
              <router-link to="/terms-of-service" class="underline">Terms of Service</router-link>
              and
              <router-link to="/privacy" class="underline">Privacy Policy</router-link>
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>
    </template>
    <slot name="footer"></slot>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { useGlobalSettings } from '@/stores/globalSettings'
import { storeToRefs } from 'pinia'
import { Checkbox } from '@/components/ui/checkbox'
const { displayLegal } = storeToRefs(useGlobalSettings())

interface InitialValues {
  description: string
}

const props = defineProps<{
  initialValues: InitialValues
}>()

const bookingSchema = z.object({
  description: z.string().optional()
})

const { values, validate } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    description: props.initialValues.description || ''
  }
})

const getValues = () => {
  return { ...values }
}
defineExpose({ getValues, validate })
</script>
