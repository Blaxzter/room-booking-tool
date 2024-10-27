<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useField, useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CalendarIcon, Clock10Icon, ClockIcon } from 'lucide-vue-next'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

interface InitialValues {
  startDate: string
  isFullDay: boolean
  startTime: string
  endTime: string
  isOnAnotherDate: boolean
  endDate: string
}

const props = defineProps<{
  initialValues: InitialValues
}>()

const bookingSchema = z
  .object({
    startDate: z.string().min(1, { message: 'Start date is required' }),
    isFullDay: z.boolean().optional(),
    startTime: z.string().min(1, { message: 'Start time is required' }).optional(),
    endTime: z.string().min(1, { message: 'End time is required' }).optional(),
    isOnAnotherDate: z.boolean().optional(),
    endDate: z.string().optional()
  })
  .refine(
    (data) => {
      const { startDate, startTime } = data
      const startDateTime = new Date(`${startDate}T${startTime}`)
      return startDateTime > new Date()
    },
    {
      message: 'Start date and time must be in the future',
      path: ['startDate', 'startTime']
    }
  )
  .refine(
    // make sure end time is after start time
    (data) => {
      const { startDate, startTime, endTime } = data
      if (!endTime) return true
      const startDateTime = new Date(`${startDate}T${startTime}`)
      const endDateTime = new Date(`${startDate}T${endTime}`)
      return endDateTime > startDateTime
    },
    {
      message: 'End time must be after start time',
      path: ['endTime']
    }
  ) // make sure if isOnAnotherDate is true, endDate is set and is after startDate
  .refine(
    (data) => {
      const { isOnAnotherDate, startDate, endDate } = data
      if (!isOnAnotherDate) return true
      return new Date(`${startDate}`) < new Date(`${endDate}`)
    },
    {
      message: 'End date must be after start date',
      path: ['endDate']
    }
  )

const { values, validate } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
  initialValues: {
    startDate: props.initialValues.startDate || dayjs().format('YYYY-MM-DD'),
    isFullDay: props.initialValues.isFullDay || false,
    startTime: props.initialValues.startTime || dayjs().add(2, 'minutes').format('HH:mm'),
    endTime: props.initialValues.endTime || dayjs().add(1, 'hour').format('HH:mm'),
    isOnAnotherDate: props.initialValues.isOnAnotherDate || false,
    endDate: props.initialValues.endDate || dayjs().add(1, 'day').format('YYYY-MM-DD')
  }
})

const invertedFullDay = computed(() => !values.isFullDay)

const startTimeSave = ref(values.startTime)
const endTimeSave = ref(values.endTime)
const endDateeSave = ref(values.endDate)

const { value: isFullDay } = useField('isFullDay')
const { value: startTime } = useField('startTime')
const { value: endTime } = useField('endTime')
const { value: isOnAnotherDate } = useField('isOnAnotherDate')
const { value: endDate } = useField('endDate')

watch(isFullDay, (newValue) => {
  if (newValue) {
    startTimeSave.value = values.startTime
    endTimeSave.value = values.endTime
    startTime.value = ''
    endTime.value = ''
  } else {
    startTime.value = startTimeSave.value
    endTime.value = endTimeSave.value
  }
})

watch(isOnAnotherDate, (newValue) => {
  if (!newValue) {
    endDateeSave.value = values.endDate
    endDate.value = ''
  } else {
    endDate.value = endDateeSave.value
  }
})

const getValues = () => {
  // change the values to the correct format
  return {
    ...values,
    is_full_day: values.isFullDay
  }
}
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <FormField v-slot="{ componentField }" name="startDate">
      <FormItem>
        <FormLabel for="date" class="text-right"> Start Date </FormLabel>
        <FormControl>
          <div class="relative">
            <Input id="date" type="date" v-bind="componentField" class="pl-10" />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CalendarIcon class="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <FormMessage />
        </FormControl>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, handleChange }" name="isFullDay">
      <FormItem class="flex flex-row items-center gap-x-3 space-y-0 rounded-md" :horizontal="true">
        <div class="space-y-1 leading-none">
          <FormLabel for="saveInfo"> Full Day </FormLabel>
          <FormMessage />
        </div>
        <FormControl>
          <Switch :checked="value" @update:checked="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>

    <Collapsible :open="invertedFullDay">
      <CollapsibleContent>
        <FormField v-slot="{ componentField }" name="startTime">
          <FormItem>
            <FormLabel for="start-time" class="text-right"> Start Time </FormLabel>
            <FormControl>
              <div class="relative">
                <Input id="start-time" type="time" v-bind="componentField" class="pl-10" />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ClockIcon class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="endTime">
          <FormItem>
            <FormLabel for="end-time" class="text-right"> End Time </FormLabel>
            <FormControl>
              <div class="relative">
                <Input id="end-time" type="time" v-bind="componentField" class="pl-10" />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock10Icon class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
      </CollapsibleContent>
    </Collapsible>

    <FormField v-slot="{ value, handleChange }" name="isOnAnotherDate">
      <FormItem class="flex flex-row items-center gap-x-3 space-y-0 rounded-md" :horizontal="true">
        <div class="space-y-1 leading-none">
          <FormLabel for="saveInfo"> Ends on another Date </FormLabel>
          <FormMessage />
        </div>
        <FormControl>
          <Switch :checked="value" @update:checked="handleChange" />
        </FormControl>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.isOnAnotherDate">
      <CollapsibleContent>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem>
            <FormLabel for="end-date" class="text-right"> End Date </FormLabel>
            <FormControl>
              <div class="relative">
                <Input id="end-date" type="date" v-bind="componentField" class="pl-10" />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CalendarIcon class="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <FormMessage />
            </FormControl>
          </FormItem>
        </FormField>
      </CollapsibleContent>
    </Collapsible>

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
