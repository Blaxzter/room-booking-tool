<script setup lang="ts">
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

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

// Define a custom validation for requiring either email or phone
const contactSchema = z
  .object({
    display_name: z.string().min(1, { message: 'Name is required' }),
    mail: z.string().email().optional(),
    phone: z.string().optional(),
    saveInfo: z.boolean().optional()
  })
  .refine((data) => data.mail || data.phone, {
    message: 'Either email or phone is required',
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
        <FormLabel for="name"> Name </FormLabel>
        <FormControl>
          <Input id="name" v-bind="componentField" />
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4">
          Please enter the Name that is displayed in the event calender. <br />
          This could be your full name or a nickname, or the name of the event.
        </FormDescription>
      </FormItem>
    </FormField>
    <FormField name="mail" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="mail"> E-Mail </FormLabel>
        <FormControl>
          <div class="relative">
            <Input id="mail" v-bind="componentField" class="pl-10" />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <MailIcon class="h-5 w-5" />
            </span>
          </div>
          <FormMessage />
        </FormControl>
        <FormDescription> Please enter your email address. </FormDescription>
      </FormItem>
    </FormField>
    <FormField name="phone" v-slot="{ componentField }">
      <FormItem>
        <FormLabel for="phone"> Phone </FormLabel>
        <FormControl>
          <div class="relative">
            <Input id="phone" v-bind="componentField" class="pl-10" />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <PhoneIcon class="h-5 w-5" />
            </span>
          </div>
          <FormMessage />
        </FormControl>
        <FormDescription class="col-span-4"> Please enter your phone number. </FormDescription>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, handleChange }" name="saveInfo">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel for="saveInfo"> Save Info </FormLabel>
          <FormDescription> Save your information on this device for future bookings. </FormDescription>
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
