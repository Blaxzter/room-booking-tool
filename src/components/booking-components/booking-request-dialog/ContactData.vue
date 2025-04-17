<script setup lang="ts">
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from 'vue-i18n'

import { MailIcon, PhoneIcon } from 'lucide-vue-next'

interface InitialValues {
  display_name: string
  mail: string
  phone: string
  saveInfo: boolean
}

const props = defineProps<{
  initialValues: InitialValues
}>()

const { t } = useI18n()

// Define a custom validation for requiring either email or phone
const contactSchema = z
  .object({
    display_name: z.string().min(1, { message: t('bookingComponents.bookingRequestDialog.contactData.validation.nameRequired') }),
    mail: z.string().email().optional(),
    phone: z.string().optional(),
    saveInfo: z.boolean().optional()
  })
  .refine((data) => data.mail || data.phone, {
    message: t('bookingComponents.bookingRequestDialog.contactData.validation.emailOrPhone'),
    path: ['mail']
  })

const { values, validate, setValues } = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: {
    display_name: props.initialValues.display_name || '',
    mail: props.initialValues.mail || '',
    phone: props.initialValues.phone || '',
    saveInfo: props.initialValues.saveInfo || false
  }
})

const getValues = () => {
  if (values.saveInfo) {
    // store in local storage
    localStorage.setItem('contactData', JSON.stringify(values))
  } else {
    // remove from local storage
    localStorage.removeItem('contactData')
  }
  return { ...values }
}

onMounted(() => {
  // Load saved data from local storage
  const savedData = localStorage.getItem('contactData')
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    setValues(parsedData)
  }
})

defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <FormField name="display_name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="name"> {{ t('bookingComponents.bookingRequestDialog.contactData.name.label') }} </FormLabel>
        <FormControl>
          <Input id="name" v-bind="componentField" />
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4">
          {{ t('bookingComponents.bookingRequestDialog.contactData.name.description') }}
        </FormDescription>
      </FormItem>
    </FormField>
    <FormField name="mail" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="mail"> {{ t('bookingComponents.bookingRequestDialog.contactData.email.label') }} </FormLabel>
        <FormControl>
          <div class="relative">
            <Input id="mail" v-bind="componentField" class="pl-10" />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <MailIcon class="h-5 w-5" />
            </span>
          </div>
          <FormMessage />
        </FormControl>
        <FormDescription> {{ t('bookingComponents.bookingRequestDialog.contactData.email.description') }} </FormDescription>
      </FormItem>
    </FormField>
    <FormField name="phone" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="phone"> {{ t('bookingComponents.bookingRequestDialog.contactData.phone.label') }} </FormLabel>
        <FormControl>
          <div class="relative">
            <Input id="phone" v-bind="componentField" class="pl-10" />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <PhoneIcon class="h-5 w-5" />
            </span>
          </div>
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4"> {{ t('bookingComponents.bookingRequestDialog.contactData.phone.description') }} </FormDescription>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, handleChange }" name="saveInfo">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel for="saveInfo"> {{ t('bookingComponents.bookingRequestDialog.contactData.saveInfo.label') }} </FormLabel>
          <FormDescription> {{ t('bookingComponents.bookingRequestDialog.contactData.saveInfo.description') }} </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <slot name="footer"></slot>
  </form>
</template>

<style scoped lang="scss">
input[type='time']::-webkit-calendar-picker-indicator,
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%);
  cursor: pointer;
}
.dark {
  input[type='time']::-webkit-calendar-picker-indicator,
  input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(94%) sepia(7%) saturate(750%) hue-rotate(185deg) brightness(105%) contrast(100%);
    cursor: pointer;
  }
}
</style>
