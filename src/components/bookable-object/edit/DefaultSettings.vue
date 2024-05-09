<script setup lang="ts">
import { computed, watch, type PropType } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { storeToRefs } from 'pinia'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Textarea } from '@/components/ui/textarea'
import GroupSelect from '@/components/bits/GroupSelect.vue'

import NameFade from '@/components/utils/NameFade.vue'

import { useGroups } from '@/stores/groups'
import { bookableObjectRandoms } from '@/assets/ts/constants'

const { selectedGroup, selectedGroupId } = storeToRefs(useGroups())

interface InitialValues {
  name?: string
  description?: string
  groupName?: string
}

const props = defineProps({
  initialValues: {
    type: Object as PropType<InitialValues>,
    required: true
  }
})

const formSchema = toTypedSchema(
  z.object({
    name: z.string({
      required_error: 'Please enter a name.'
    }),
    description: z.string({
      required_error: 'Please enter a description.'
    }),
    groupName: z.string({
      required_error: 'Please select an email to display.'
    })
  })
)

const { name, description, groupName } = props.initialValues

const { values, validate } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: name,
    description: description,
    groupName: groupName || selectedGroupId.value
  }
})

// watch selectedGroup
watch(selectedGroup, (value) => {
  console.log('selectedGroup', value)
})

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-4 py-4">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="The moon" v-bind="componentField" />
        </FormControl>
        <FormDescription> Please enter the name of the bookable object. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea placeholder="The moon is a beautiful place." v-bind="componentField" />
        </FormControl>
        <FormDescription> Please enter the description of the bookable object. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="groupName">
      <FormItem>
        <FormLabel>Group</FormLabel>
        <GroupSelect :selectedGroup="componentField" />
        <FormDescription>
          Please select the group of the bookable object.
          <span v-if="selectedGroupId">Your currently selected group is chosen by default.</span>
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <slot name="footer">
      <Button type="submit" class="min-w-[120px]">
        <span>Create <NameFade :messages="bookableObjectRandoms" /></span>
      </Button>
    </slot>
  </form>
</template>

<style scoped></style>
