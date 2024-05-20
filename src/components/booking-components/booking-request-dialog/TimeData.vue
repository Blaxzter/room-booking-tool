<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface InitialValues {
  startDate: string
  startTime: string
  endTime: string
}

const props = defineProps<{
  initialValues: InitialValues
}>()

const bookingSchema = z.object({
  startDate: z.string().min(1, { message: 'Start date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' })
})

const { values, validate } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    startDate: props.initialValues.startDate || '',
    startTime: props.initialValues.startTime || '',
    endTime: props.initialValues.endTime || ''
  }
})

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <FormField v-slot="{ componentField }" name="startDate">
      <FormItem>
        <FormLabel for="date" class="text-right"> Start Date </FormLabel>
        <FormControl class="col-span-3">
          <Input type="date" id="date" v-bind="componentField" />
          <FormMessage />
        </FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="startTime">
      <FormItem>
        <FormLabel for="start-time" class="text-right"> Start Time </FormLabel>
        <FormControl class="col-span-3">
          <Input type="time" id="start-time" v-bind="componentField" />
          <FormMessage />
        </FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="endTime">
      <FormItem>
        <FormLabel for="end-time" class="text-right"> End Time </FormLabel>
        <FormControl class="col-span-3">
          <Input type="time" id="end-time" v-bind="componentField" />
          <FormMessage />
        </FormControl>
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
