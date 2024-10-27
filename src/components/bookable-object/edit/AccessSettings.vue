<script setup lang="ts">
import { computed, ref, type PropType, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CopyIcon } from '@radix-icons/vue'

import NameFade from '@/components/utils/NameFade.vue'
import { bookableObjectRandomsLower } from '@/assets/ts/constants'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { BookableObject } from '@/types'
interface InitialValues {
  is_internal: boolean
  confirm_booking_required: boolean
  information_shared: boolean
  confirm_role: string
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

defineEmits(['update'])

const formSchema = toTypedSchema(
  z.object({
    is_internal: z.boolean(),
    uniqueId: z.string().optional(),
    confirm_booking_required: z.boolean(),
    information_shared: z.boolean(),
    confirm_role: z.string().optional()
  })
)

const roles = [
  { id: 'admin', name: 'Admin' },
  { id: 'member', name: 'Member' }
]

// Copy link stuff

const visibleMessage = ref('')

const currentHost = computed(() => {
  return window.location.protocol + '//' + window.location.host
})

const randomString = Math.random().toString(36).substring(2, 10)

const copyLink = () => {
  navigator.clipboard.writeText(`${window.location.host}/${visibleMessage.value}/${randomString}`)
}

const { values, validate, setValues } = useForm({
  validationSchema: formSchema
})

onBeforeMount(() => {
  if (props.initialValues) {
    setValues({
      is_internal: props.initialValues.is_internal || false,
      uniqueId: randomString,
      confirm_booking_required: props.initialValues.confirm_booking_required || false,
      information_shared: props.initialValues.information_shared || true,
      confirm_role: props.initialValues.confirm_role || 'member'
    })
  } else if (props.bookableObject) {
    setValues({
      is_internal: props.bookableObject.is_internal,
      uniqueId: props.bookableObject.uniqueId,
      confirm_booking_required: props.bookableObject.confirm_booking_required,
      information_shared: props.bookableObject.information_shared,
      confirm_role: props.bookableObject.confirm_role || 'member'
    })
  }
})

const getValues = computed(() => values)
defineExpose({ getValues, validate })
</script>

<template>
  <form class="grid gap-5 py-4">
    <div class="text-lg font-semibold mb-2">Access Settings</div>
    <FormField v-slot="{ value, handleChange }" name="is_internal">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" @click="$emit('update', 'is_internal', !value)" />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>Public Visible</FormLabel>
          <FormDescription> Toggle to make the bookable object publicly visible. </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.is_internal">
      <CollapsibleContent>
        <div>Link</div>
        <div class="flex items-center justify-between gap-x-2 border rounded px-3 py-0.5 max-w-full">
          <span class="text-xs text-gray-500 truncate overflow-ellipsis"
            >{{ currentHost }}/<NameFade
              :messages="bookableObjectRandomsLower"
              @value-changed="visibleMessage = $event"
            />/{{ values.uniqueId }}</span
          >
          <CollapsibleTrigger>
            <Button size="sm" variant="ghost" @click="copyLink" type="button">
              <CopyIcon class="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <FormField v-slot="{ value, handleChange }" name="confirm_booking_required">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox
            :checked="value"
            @update:checked="handleChange"
            @click="$emit('update', 'confirm_booking_required', !value)"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>Booking requires confirmation</FormLabel>
          <FormDescription>
            If this is set to off, a booking doesnt require confirmation and it gets automatically confirmed.
          </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <Collapsible v-model:open="values.confirm_booking_required">
      <CollapsibleContent>
        <FormField v-slot="{ componentField }" name="confirm_role">
          <FormItem>
            <FormLabel>Confirm Role</FormLabel>
            <Select v-bind="componentField" @update:modelValue="$emit('update', 'confirm_role', values.confirm_role)">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription> Select the role a group member needs to confirm a booking. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </CollapsibleContent>
    </Collapsible>

    <FormField v-slot="{ value, handleChange }" name="information_shared">
      <FormItem class="flex flex-row items-start gap-x-3 space-y-0 rounded-md">
        <FormControl>
          <Checkbox
            :checked="value"
            @update:checked="handleChange"
            @click="$emit('update', 'information_shared', !value)"
          />
        </FormControl>
        <div class="space-y-1 leading-none">
          <FormLabel>Information shared</FormLabel>
          <FormDescription> Everyone with the sharing link can view booking details. </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <slot name="footer"></slot>
  </form>
</template>

<style scoped></style>
