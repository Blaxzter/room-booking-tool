<template>
  <form class="grid gap-5 py-4">
    <FormField name="description" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="description"> {{ t('bookingComponents.bookingRequestDialog.eventData.description.label') }} </FormLabel>
        <FormControl class="col-span-3">
          <Textarea id="description" v-bind="componentField" />
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4"> {{ t('bookingComponents.bookingRequestDialog.eventData.description.description') }} </FormDescription>
      </FormItem>
    </FormField>
    <template v-if="displayLegal && publicBookableObjectId">
      <FormField v-slot="{ value, handleChange }" type="checkbox" name="legal">
        <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
          <FormControl>
            <Checkbox :checked="value" @update:checked="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>{{ t('bookingComponents.bookingRequestDialog.eventData.legal.label') }}</FormLabel>
            <FormDescription>
              {{ t('bookingComponents.bookingRequestDialog.eventData.legal.description') }}
              <router-link to="/terms-of-service" class="underline">{{ t('bookingComponents.bookingRequestDialog.eventData.legal.termsOfService') }}</router-link>
              {{ t('bookingComponents.bookingRequestDialog.eventData.legal.and') }}
              <router-link to="/privacy" class="underline">{{ t('bookingComponents.bookingRequestDialog.eventData.legal.privacyPolicy') }}</router-link>
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
import { useI18n } from 'vue-i18n'

import { useBookings } from '@/stores/booking'
import { useGlobalSettings } from '@/stores/globalSettings'
import { storeToRefs } from 'pinia'
import { Checkbox } from '@/components/ui/checkbox'

const { displayLegal } = storeToRefs(useGlobalSettings())
const { publicBookableObjectId } = storeToRefs(useBookings())
const { t } = useI18n()

interface InitialValues {
  description: string
  legal?: boolean
}

const props = defineProps<{
  initialValues: InitialValues
}>()

const bookingSchema = z.object({
  description: z.string().optional(),
  ...(displayLegal.value && publicBookableObjectId.value ? { legal: z.literal(true, { errorMap: () => ({ message: t('bookingComponents.bookingRequestDialog.eventData.legal.required') }) }) } : {})
})

const { values, validate } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    description: props.initialValues.description || '',
    ...(displayLegal.value && publicBookableObjectId.value ? { legal: props.initialValues.legal || false } : {})
  }
})

const getValues = () => {
  return { ...values }
}
defineExpose({ getValues, validate })
</script>
