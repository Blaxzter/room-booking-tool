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
    <slot name="footer"></slot>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

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
