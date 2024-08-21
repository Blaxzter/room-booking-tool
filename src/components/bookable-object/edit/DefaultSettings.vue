<script setup lang="ts">
import { computed, type PropType, onBeforeMount, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import GroupSelect from '@/components/bits/GroupSelect.vue'
import { randomBookableObject } from '@/assets/ts/constants'
const exampleObject = randomBookableObject()

import type { BookableObject } from '@/types'

interface InitialValues {
  name?: string
  description?: string
  groupId?: string
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<InitialValues>,
    required: false
  },
  bookableObject: {
    type: Object as PropType<BookableObject>,
    required: false
  }
})
const emit = defineEmits(['update'])

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, { message: 'Please enter a name that is at least 3 characters long.' }),
    description: z
      .string({
        required_error: 'Please enter a description.'
      })
      .optional(),
    groupId: z.string({
      required_error: 'Please select a group.'
    })
  })
)

const { values, validate, setValues } = useForm({
  validationSchema: formSchema
})

onBeforeMount(() => {
  if (props.initialValues) {
    setValues({
      name: props.initialValues.name,
      description: props.initialValues.description,
      groupId: props.initialValues.groupId
    })
  } else if (props.bookableObject) {
    const groups = props.bookableObject.group
    let groupId = ''
    if (groups && groups.length > 0) {
      const firstGroup = groups[0]
      // check if firstGroup is string
      if (typeof firstGroup === 'string') {
        groupId = firstGroup
      } else {
        groupId = firstGroup.group_id.id
      }
    }

    setValues({
      name: props.bookableObject.name,
      description: props.bookableObject.description || '',
      groupId: groupId || '-1'
    })
  }
})

const pendingChanges = ref<string[]>([])

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-4 pt-4 w-full">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name {{ pendingChanges.includes('name') && props.bookableObject ? ' *' : '' }}</FormLabel>
        <FormControl>
          <Input
            type="text"
            :placeholder="exampleObject.name"
            @input="
              (e: Event) => {
                const target = e.target as HTMLInputElement
                if (target.value != bookableObject?.name && !pendingChanges.includes('name')) {
                  pendingChanges.push('name')
                } else if (target.value == bookableObject?.name) {
                  pendingChanges.splice(pendingChanges.indexOf('name'), 1)
                }
              }
            "
            @blur="
              (e: Event) => {
                if (props.bookableObject) {
                  emit('update', 'name', (e.target as HTMLInputElement).value)
                  pendingChanges.splice(pendingChanges.indexOf('name'), 1)
                }
              }
            "
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription> Please enter the name of the bookable object. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel
          >Description {{ pendingChanges.includes('description') && props.bookableObject ? ' *' : '' }}</FormLabel
        >
        <FormControl>
          <Textarea
            :placeholder="exampleObject.description"
            @input="
              (e: Event) => {
                const target = e.target as HTMLInputElement
                if (target.value != bookableObject?.name && !pendingChanges.includes('description')) {
                  pendingChanges.push('description')
                } else if (target.value == bookableObject?.name) {
                  pendingChanges.splice(pendingChanges.indexOf('description'), 1)
                }
              }
            "
            @blur="
              (e: Event) => {
                if (props.bookableObject) {
                  emit('update', 'description', (e.target as HTMLInputElement).value)
                  pendingChanges.splice(pendingChanges.indexOf('description'), 1)
                }
              }
            "
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription> Please enter the description of the bookable object. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="groupId">
      <FormItem>
        <FormLabel>Group</FormLabel>
        <GroupSelect v-bind="componentField" :include-person="true" :editable="!props.bookableObject" />
        <FormDescription> Please select the group of the bookable object. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot name="footer"></slot>
  </form>
</template>

<style scoped></style>
